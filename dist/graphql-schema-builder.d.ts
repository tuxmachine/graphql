import { GraphQLSchema } from 'graphql';
import { BuildSchemaOptions } from './external/type-graphql.types';
import { ScalarsExplorerService } from './services';
export declare class GraphQLSchemaBuilder {
  private readonly scalarsExplorerService;
  constructor(scalarsExplorerService: ScalarsExplorerService);
  build(
    autoSchemaFile: string | boolean,
    options: BuildSchemaOptions,
    resolvers: Function[],
  ): Promise<any>;
  buildFederatedSchema(
    autoSchemaFile: string | boolean,
    options: BuildSchemaOptions,
    resolvers: Function[],
  ): Promise<GraphQLSchema>;
  private loadBuildSchemaFactory;
  private loadFederationDirectives;
}
