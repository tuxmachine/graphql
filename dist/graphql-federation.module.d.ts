import { DynamicModule, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost, ApplicationConfig } from '@nestjs/core';
import { GraphQLFederationFactory } from './graphql-federation.factory';
import { GraphQLTypesLoader } from './graphql-types.loader';
import { GqlModuleAsyncOptions, GqlModuleOptions } from './interfaces';
import { GraphQLFactory } from './graphql.factory';
export declare class GraphQLFederationModule implements OnModuleInit {
  private readonly httpAdapterHost;
  private readonly options;
  private readonly graphqlFederationFactory;
  private readonly graphqlTypesLoader;
  private readonly graphqlFactory;
  private readonly applicationConfig;
  private apolloServer;
  constructor(
    httpAdapterHost: HttpAdapterHost,
    options: GqlModuleOptions,
    graphqlFederationFactory: GraphQLFederationFactory,
    graphqlTypesLoader: GraphQLTypesLoader,
    graphqlFactory: GraphQLFactory,
    applicationConfig: ApplicationConfig,
  );
  static forRoot(options?: GqlModuleOptions): DynamicModule;
  static forRootAsync(options: GqlModuleAsyncOptions): DynamicModule;
  private static createAsyncProviders;
  private static createAsyncOptionsProvider;
  onModuleInit(): Promise<void>;
  private registerGqlServer;
  private registerExpress;
  private registerFastify;
  private getNormalizedPath;
}
