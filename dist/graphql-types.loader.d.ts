export declare class GraphQLTypesLoader {
  mergeTypesByPaths(paths: string | string[]): Promise<string>;
  getTypesFromPaths(paths: string | string[]): Promise<string[]>;
}
