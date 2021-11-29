import { envelop, GetEnvelopedFn, useSchema } from '@envelop/core';
import { Injectable } from '@nestjs/common';
import { isFunction } from '@nestjs/common/utils/shared.utils';
import { ModulesContainer } from '@nestjs/core';
import { AbstractGraphQLDriver } from '@nestjs/graphql/drivers/abstract-graphql.driver';
import * as express from 'express';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { printSchema } from 'graphql';
import * as helix from 'graphql-helix';
import { HelixDriverConfig } from '../interfaces/helix-driver-config.interface';
import { PluginsExplorerService } from '../services/plugins-explorer.service';

@Injectable()
export class HelixDriver extends AbstractGraphQLDriver<HelixDriverConfig> {
  private readonly pluginsExplorerService: PluginsExplorerService;
  private envelopFactory: GetEnvelopedFn<any>;

  constructor(modulesContainer: ModulesContainer) {
    super();
    this.pluginsExplorerService = new PluginsExplorerService(modulesContainer);
  }

  public async stop(): Promise<void> {}

  public async start(mercuriusOptions: HelixDriverConfig) {
    const options =
      await this.graphQlFactory.mergeWithSchema<HelixDriverConfig>(
        mercuriusOptions,
      );

    if (options.definitions && options.definitions.path) {
      await this.graphQlFactory.generateDefinitions(
        printSchema(options.schema),
        options,
      );
    }

    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const platformName = httpAdapter.getType();

    this.envelopFactory = envelop({
      plugins: [
        useSchema(options.schema),
        ...options.plugins,
        ...this.pluginsExplorerService.explore(options),
      ],
    });

    if (platformName === 'fastify') {
      await this.registerFastify(httpAdapter.getInstance(), options);
    } else if (platformName === 'express') {
      await this.registerExpress(httpAdapter.getInstance(), options);
    }
  }

  public async registerExpress(
    app: express.Application,
    options: HelixDriverConfig,
  ) {
    app.use(options.path, async (req, res) =>
      this.handleRequest(options, req, res),
    );
  }

  public async registerFastify(
    app: FastifyInstance,
    options: HelixDriverConfig,
  ) {
    app.route({
      method: ['GET', 'POST'],
      url: options.path,
      handler: async (req, res) => this.handleRequest(options, req, res),
    });
  }

  private async handleRequest(
    options: HelixDriverConfig,
    req: express.Request | FastifyRequest,
    res: express.Response | FastifyReply,
  ) {
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    if (helix.shouldRenderGraphiQL(request)) {
      return res.send(
        helix.renderGraphiQL({
          endpoint: options.path,
          ...(typeof options.playground === 'boolean'
            ? {}
            : options.playground),
        }),
      );
    }

    const { operationName, query, variables } =
      helix.getGraphQLParameters(request);
    const { validate, parse, contextFactory, execute, subscribe, schema } =
      this.envelopFactory(options.context(req));

    const result = await helix.processRequest({
      validate,
      parse,
      contextFactory,
      execute,
      subscribe,
      schema,
      operationName,
      query,
      variables,
      request,
    });
    helix.sendResult(result, 'raw' in res ? res.raw : res);
  }

  public async mergeDefaultOptions(
    options: HelixDriverConfig,
  ): Promise<HelixDriverConfig> {
    options = await super.mergeDefaultOptions(options, {
      path: '/graphql',
      playground: process.env.NODE_ENV !== 'production',
    });
    this.wrapContextResolver(options);
    return options;
  }

  private wrapContextResolver(
    targetOptions: HelixDriverConfig,
    originalOptions: HelixDriverConfig = { ...targetOptions },
  ) {
    if (!targetOptions.context) {
      targetOptions.context = (req: unknown) => ({ req });
    } else if (isFunction(targetOptions.context)) {
      targetOptions.context = async (...args: unknown[]) => {
        const ctx = await (originalOptions.context as Function)(...args);
        const { req, request } = args[0] as Record<string, unknown>;
        return this.assignReqProperty(ctx, req ?? request);
      };
    } else {
      targetOptions.context = (req: Record<string, unknown>) => {
        return this.assignReqProperty(
          originalOptions.context as Record<string, any>,
          req,
        );
      };
    }
  }

  private assignReqProperty(
    ctx: Record<string, unknown> | undefined,
    req: unknown,
  ) {
    if (!ctx) {
      return { req };
    }
    if (
      typeof ctx !== 'object' ||
      (ctx && ctx.req && typeof ctx.req === 'object')
    ) {
      return ctx;
    }
    ctx.req = req;
    return ctx;
  }
}
