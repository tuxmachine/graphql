"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const apollo_server_core_1 = require("apollo-server-core");
const graphql_tools_1 = require("graphql-tools");
const chokidar = require("chokidar");
const graphql_1 = require("graphql");
const graphql_ast_explorer_1 = require("./graphql-ast.explorer");
const graphql_types_loader_1 = require("./graphql-types.loader");
const utils_1 = require("./utils");
class GraphQLDefinitionsFactory {
    constructor() {
        this.gqlAstExplorer = new graphql_ast_explorer_1.GraphQLAstExplorer();
        this.gqlTypesLoader = new graphql_types_loader_1.GraphQLTypesLoader();
    }
    generate(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isDebugEnabled = !(options && options.debug === false);
            const typePathsExists = options.typePaths && !shared_utils_1.isEmpty(options.typePaths);
            const isFederation = options && options.federation;
            if (!typePathsExists) {
                throw new Error(`"typePaths" property cannot be empty.`);
            }
            if (options.watch) {
                this.printMessage('GraphQL factory is watching your files...', isDebugEnabled);
                const watcher = chokidar.watch(options.typePaths);
                watcher.on('change', (file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    this.printMessage(`[${new Date().toLocaleTimeString()}] "${file}" has been changed.`, isDebugEnabled);
                    yield this.exploreAndEmit(options.typePaths, options.path, options.outputAs, isFederation, isDebugEnabled);
                }));
            }
            yield this.exploreAndEmit(options.typePaths, options.path, options.outputAs, isFederation, isDebugEnabled);
        });
    }
    exploreAndEmit(typePaths, path, outputAs, isFederation, isDebugEnabled) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (isFederation) {
                return this.exploreAndEmitFederation(typePaths, path, outputAs, isDebugEnabled);
            }
            return this.exploreAndEmitRegular(typePaths, path, outputAs, isDebugEnabled);
        });
    }
    exploreAndEmitFederation(typePaths, path, outputAs, isDebugEnabled) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const typeDefs = yield this.gqlTypesLoader.getTypesFromPaths(typePaths);
            const { buildFederatedSchema } = load_package_util_1.loadPackage('@apollo/federation', 'ApolloFederation');
            const { printSchema } = load_package_util_1.loadPackage('@apollo/federation', 'ApolloFederation');
            const schema = buildFederatedSchema([
                {
                    typeDefs: apollo_server_core_1.gql `
          ${typeDefs}
        `,
                    resolvers: {},
                },
            ]);
            const tsFile = yield this.gqlAstExplorer.explore(apollo_server_core_1.gql `
        ${printSchema(schema)}
      `, path, outputAs);
            yield tsFile.save();
            this.printMessage(`[${new Date().toLocaleTimeString()}] The definitions have been updated.`, isDebugEnabled);
        });
    }
    exploreAndEmitRegular(typePaths, path, outputAs, isDebugEnabled) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const typeDefs = yield this.gqlTypesLoader.mergeTypesByPaths(typePaths || []);
            if (!typeDefs) {
                throw new Error(`"typeDefs" property cannot be null.`);
            }
            let schema = graphql_tools_1.makeExecutableSchema({
                typeDefs,
                resolverValidationOptions: { allowResolversNotInSchema: true },
            });
            schema = utils_1.removeTempField(schema);
            const tsFile = yield this.gqlAstExplorer.explore(apollo_server_core_1.gql `
        ${graphql_1.printSchema(schema)}
      `, path, outputAs);
            yield tsFile.save();
            this.printMessage(`[${new Date().toLocaleTimeString()}] The definitions have been updated.`, isDebugEnabled);
        });
    }
    printMessage(text, isEnabled) {
        isEnabled && console.log(text);
    }
}
exports.GraphQLDefinitionsFactory = GraphQLDefinitionsFactory;
