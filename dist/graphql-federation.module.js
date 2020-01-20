"use strict";
var GraphQLFederationModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const core_1 = require("@nestjs/core");
const graphql_federation_factory_1 = require("./graphql-federation.factory");
const services_1 = require("./services");
const graphql_ast_explorer_1 = require("./graphql-ast.explorer");
const graphql_types_loader_1 = require("./graphql-types.loader");
const graphql_schema_builder_1 = require("./graphql-schema-builder");
const graphql_constants_1 = require("./graphql.constants");
const utils_1 = require("./utils");
const graphql_factory_1 = require("./graphql.factory");
let GraphQLFederationModule = GraphQLFederationModule_1 = class GraphQLFederationModule {
    constructor(httpAdapterHost, options, graphqlFederationFactory, graphqlTypesLoader, graphqlFactory, applicationConfig) {
        this.httpAdapterHost = httpAdapterHost;
        this.options = options;
        this.graphqlFederationFactory = graphqlFederationFactory;
        this.graphqlTypesLoader = graphqlTypesLoader;
        this.graphqlFactory = graphqlFactory;
        this.applicationConfig = applicationConfig;
    }
    static forRoot(options = {}) {
        options = utils_1.mergeDefaults(options);
        return {
            module: GraphQLFederationModule_1,
            providers: [
                {
                    provide: graphql_constants_1.GRAPHQL_MODULE_OPTIONS,
                    useValue: options,
                },
            ],
        };
    }
    static forRootAsync(options) {
        return {
            module: GraphQLFederationModule_1,
            imports: options.imports,
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: graphql_constants_1.GRAPHQL_MODULE_ID,
                    useValue: utils_1.generateString(),
                },
            ],
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: graphql_constants_1.GRAPHQL_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: graphql_constants_1.GRAPHQL_MODULE_OPTIONS,
            useFactory: (optionsFactory) => optionsFactory.createGqlOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
    onModuleInit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.httpAdapterHost || !this.httpAdapterHost.httpAdapter) {
                return;
            }
            const { printSchema } = load_package_util_1.loadPackage('@apollo/federation', 'ApolloFederation');
            const { typePaths } = this.options;
            const typeDefs = yield this.graphqlTypesLoader.mergeTypesByPaths(typePaths);
            const apolloOptions = yield this.graphqlFederationFactory.mergeOptions(Object.assign(Object.assign({}, this.options), { typeDefs }));
            if (this.options.definitions && this.options.definitions.path) {
                yield this.graphqlFactory.generateDefinitions(printSchema(apolloOptions.schema), this.options);
            }
            this.registerGqlServer(apolloOptions);
            if (this.options.installSubscriptionHandlers) {
                throw new Error('No support for subscriptions yet when using Apollo Federation');
            }
        });
    }
    registerGqlServer(apolloOptions) {
        const httpAdapter = this.httpAdapterHost.httpAdapter;
        const adapterName = httpAdapter.constructor && httpAdapter.constructor.name;
        if (adapterName === 'ExpressAdapter') {
            this.registerExpress(apolloOptions);
        }
        else if (adapterName === 'FastifyAdapter') {
            this.registerFastify(apolloOptions);
        }
        else {
            throw new Error(`No support for current HttpAdapter: ${adapterName}`);
        }
    }
    registerExpress(apolloOptions) {
        const { ApolloServer } = load_package_util_1.loadPackage('apollo-server-express', 'GraphQLModule', () => require('apollo-server-express'));
        const { disableHealthCheck, onHealthCheck, cors, bodyParserConfig } = this.options;
        const app = this.httpAdapterHost.httpAdapter.getInstance();
        const path = this.getNormalizedPath(apolloOptions);
        const apolloServer = new ApolloServer(apolloOptions);
        apolloServer.applyMiddleware({
            app,
            path,
            disableHealthCheck,
            onHealthCheck,
            cors,
            bodyParserConfig,
        });
        this.apolloServer = apolloServer;
    }
    registerFastify(apolloOptions) {
        const { ApolloServer } = load_package_util_1.loadPackage('apollo-server-fastify', 'GraphQLModule', () => require('apollo-server-fastify'));
        const httpAdapter = this.httpAdapterHost.httpAdapter;
        const app = httpAdapter.getInstance();
        const path = this.getNormalizedPath(apolloOptions);
        const apolloServer = new ApolloServer(apolloOptions);
        const { disableHealthCheck, onHealthCheck, cors, bodyParserConfig } = this.options;
        app.register(apolloServer.createHandler({
            disableHealthCheck,
            onHealthCheck,
            cors,
            bodyParserConfig,
            path,
        }));
        this.apolloServer = apolloServer;
    }
    getNormalizedPath(apolloOptions) {
        const prefix = this.applicationConfig.getGlobalPrefix();
        const useGlobalPrefix = prefix && this.options.useGlobalPrefix;
        const gqlOptionsPath = utils_1.normalizeRoutePath(apolloOptions.path);
        return useGlobalPrefix ? utils_1.normalizeRoutePath(prefix) + gqlOptionsPath : gqlOptionsPath;
    }
};
GraphQLFederationModule = GraphQLFederationModule_1 = tslib_1.__decorate([
    common_1.Module({
        providers: [
            graphql_federation_factory_1.GraphQLFederationFactory,
            graphql_factory_1.GraphQLFactory,
            metadata_scanner_1.MetadataScanner,
            services_1.ResolversExplorerService,
            services_1.DelegatesExplorerService,
            services_1.ScalarsExplorerService,
            graphql_ast_explorer_1.GraphQLAstExplorer,
            graphql_types_loader_1.GraphQLTypesLoader,
            graphql_schema_builder_1.GraphQLSchemaBuilder,
        ],
        exports: [],
    }),
    tslib_1.__param(0, common_1.Optional()),
    tslib_1.__param(1, common_1.Inject(graphql_constants_1.GRAPHQL_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [core_1.HttpAdapterHost, Object, graphql_federation_factory_1.GraphQLFederationFactory,
        graphql_types_loader_1.GraphQLTypesLoader,
        graphql_factory_1.GraphQLFactory,
        core_1.ApplicationConfig])
], GraphQLFederationModule);
exports.GraphQLFederationModule = GraphQLFederationModule;
