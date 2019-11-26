import {
  ScalarsExplorerService,
  DelegatesExplorerService,
  ResolversExplorerService,
} from './services';
import { GqlModuleOptions } from './interfaces';
import { GraphQLSchemaBuilder } from './graphql-schema-builder';
import { GraphQLFactory } from './graphql.factory';
export declare class GraphQLFederationFactory {
  private readonly resolversExplorerService;
  private readonly delegatesExplorerService;
  private readonly scalarsExplorerService;
  private readonly gqlSchemaBuilder;
  private readonly graphqlFactory;
  constructor(
    resolversExplorerService: ResolversExplorerService,
    delegatesExplorerService: DelegatesExplorerService,
    scalarsExplorerService: ScalarsExplorerService,
    gqlSchemaBuilder: GraphQLSchemaBuilder,
    graphqlFactory: GraphQLFactory,
  );
  mergeOptions(options?: GqlModuleOptions): Promise<GqlModuleOptions>;
  private buildSchemaFromTypeDefs;
  private generateSchema;
  private getResolvers;
  private extendResolvers;
}
