import { SchemaDirectiveVisitor } from '@graphql-tools/utils';
import { Injectable } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { ModulesContainer } from '@nestjs/core';
import { GraphQLFederationFactory } from '@nestjs/graphql-experimental/federation/graphql-federation.factory';
import { extend } from '@nestjs/graphql-experimental/utils/extend.util';
import { ApolloDriverConfig } from '..';
import { PluginsExplorerService } from '../services/plugins-explorer.service';
import { ApolloBaseDriver } from './apollo-base.driver';

@Injectable()
export class ApolloFederationDriver extends ApolloBaseDriver {
  private readonly pluginsExplorerService: PluginsExplorerService;

  constructor(
    private readonly graphqlFederationFactory: GraphQLFederationFactory,
    modulesContainer: ModulesContainer,
  ) {
    super();
    this.pluginsExplorerService = new PluginsExplorerService(modulesContainer);
  }

  public async start(options: ApolloDriverConfig): Promise<void> {
    options.plugins = extend(
      options.plugins || [],
      this.pluginsExplorerService.explore(options),
    );

    const adapterOptions = await this.graphqlFederationFactory.mergeWithSchema(
      options,
    );
    await this.runExecutorFactoryIfPresent(adapterOptions);

    if (options.definitions && options.definitions.path) {
      const { printSubgraphSchema } = loadPackage(
        '@apollo/subgraph',
        'ApolloFederation',
        () => require('@apollo/subgraph'),
      );
      await this.graphQlFactory.generateDefinitions(
        printSubgraphSchema(adapterOptions.schema),
        options,
      );
    }

    await super.start(adapterOptions);

    if (options.installSubscriptionHandlers || options.subscriptions) {
      // TL;DR <https://github.com/apollographql/apollo-server/issues/2776>
      throw new Error(
        'No support for subscriptions yet when using Apollo Federation',
      );
    }
  }

  protected async registerExpress(apolloOptions: ApolloDriverConfig) {
    return super.registerExpress(apolloOptions, {
      preStartHook: () => {
        // If custom directives are provided merge them into schema per Apollo
        // https://www.apollographql.com/docs/apollo-server/federation/implementing-services/#defining-custom-directives
        if (apolloOptions.schemaDirectives) {
          SchemaDirectiveVisitor.visitSchemaDirectives(
            apolloOptions.schema,
            apolloOptions.schemaDirectives,
          );
        }
      },
    });
  }

  protected async registerFastify(apolloOptions: ApolloDriverConfig) {
    return super.registerFastify(apolloOptions, {
      preStartHook: () => {
        // If custom directives are provided merge them into schema per Apollo
        // https://www.apollographql.com/docs/apollo-server/federation/implementing-services/#defining-custom-directives
        if (apolloOptions.schemaDirectives) {
          SchemaDirectiveVisitor.visitSchemaDirectives(
            apolloOptions.schema,
            apolloOptions.schemaDirectives,
          );
        }
      },
    });
  }

  private async runExecutorFactoryIfPresent(apolloOptions: ApolloDriverConfig) {
    if (!apolloOptions.executorFactory) {
      return;
    }
    const executor = await apolloOptions.executorFactory(apolloOptions.schema);
    apolloOptions.executor = executor;
  }
}