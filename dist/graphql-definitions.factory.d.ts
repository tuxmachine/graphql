export declare class GraphQLDefinitionsFactory {
  private readonly gqlAstExplorer;
  private readonly gqlTypesLoader;
  generate(options: {
    typePaths: string[];
    path: string;
    outputAs?: 'class' | 'interface';
    watch?: boolean;
    debug?: boolean;
    federation?: boolean;
  }): Promise<void>;
  private exploreAndEmit;
  private exploreAndEmitFederation;
  private exploreAndEmitRegular;
  private printMessage;
}
