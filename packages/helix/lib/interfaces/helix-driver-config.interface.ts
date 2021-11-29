import * as envelop from '@envelop/core';
import {
  GqlModuleAsyncOptions,
  GqlModuleOptions,
  GqlOptionsFactory,
} from '@nestjs/graphql';
import * as helix from 'graphql-helix';

export interface HelixPluginFactory {
  createPlugin(): envelop.Plugin;
}

type HelixOptions<TContext = Record<string, any>> = {
  path?: string;
  playground?: boolean | helix.RenderGraphiQLOptions;
  context?: (
    executionContext: helix.ExecutionContext,
  ) => Promise<TContext> | TContext;
  plugins?: Array<envelop.Plugin>;
};
export type HelixDriverConfig = GqlModuleOptions & HelixOptions;

export type HelixDriverConfigFactory = GqlOptionsFactory<HelixDriverConfig>;
export type HelixDriverAsyncConfig = GqlModuleAsyncOptions<HelixDriverConfig>;
