import {
  ScalarsExplorerService,
  DelegatesExplorerService,
  ResolversExplorerService,
} from './services';
import { GqlModuleOptions } from './interfaces';
export declare class GraphQLFederationFactory {
  private readonly resolversExplorerService;
  private readonly delegatesExplorerService;
  private readonly scalarsExplorerService;
  constructor(
    resolversExplorerService: ResolversExplorerService,
    delegatesExplorerService: DelegatesExplorerService,
    scalarsExplorerService: ScalarsExplorerService,
  );
  private extendResolvers;
  mergeOptions(options?: GqlModuleOptions): Promise<GqlModuleOptions>;
}
