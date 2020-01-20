"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const modules_container_1 = require("@nestjs/core/injector/modules-container");
const graphql_1 = require("graphql");
const graphql_constants_1 = require("../graphql.constants");
const base_explorer_service_1 = require("./base-explorer.service");
let ScalarsExplorerService = class ScalarsExplorerService extends base_explorer_service_1.BaseExplorerService {
    constructor(modulesContainer, gqlOptions) {
        super();
        this.modulesContainer = modulesContainer;
        this.gqlOptions = gqlOptions;
    }
    explore() {
        const modules = this.getModules(this.modulesContainer, this.gqlOptions.include || []);
        return this.flatMap(modules, instance => this.filterImplicitScalar(instance));
    }
    filterImplicitScalar(wrapper) {
        const { instance } = wrapper;
        if (!instance) {
            return undefined;
        }
        const metadata = Reflect.getMetadata(graphql_constants_1.SCALAR_NAME_METADATA, instance.constructor);
        const bindContext = (fn) => fn ? fn.bind(instance) : undefined;
        return metadata
            ? {
                [metadata]: new graphql_1.GraphQLScalarType({
                    name: metadata,
                    description: instance['description'],
                    parseValue: bindContext(instance.parseValue),
                    serialize: bindContext(instance.serialize),
                    parseLiteral: bindContext(instance.parseLiteral),
                }),
            }
            : undefined;
    }
    getScalarsMap() {
        const modules = this.getModules(this.modulesContainer, this.gqlOptions.include || []);
        return this.flatMap(modules, instance => this.filterExplicitScalar(instance));
    }
    filterExplicitScalar(wrapper) {
        const { instance } = wrapper;
        if (!instance) {
            return undefined;
        }
        const scalarNameMetadata = Reflect.getMetadata(graphql_constants_1.SCALAR_NAME_METADATA, instance.constructor);
        const scalarTypeMetadata = Reflect.getMetadata(graphql_constants_1.SCALAR_TYPE_METADATA, instance.constructor);
        const bindContext = (fn) => fn ? fn.bind(instance) : undefined;
        return scalarNameMetadata
            ? {
                type: (shared_utils_1.isFunction(scalarTypeMetadata) && scalarTypeMetadata()) ||
                    instance.constructor,
                scalar: new graphql_1.GraphQLScalarType({
                    name: scalarNameMetadata,
                    description: instance['description'],
                    parseValue: bindContext(instance.parseValue),
                    serialize: bindContext(instance.serialize),
                    parseLiteral: bindContext(instance.parseLiteral),
                }),
            }
            : undefined;
    }
};
ScalarsExplorerService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(1, common_1.Inject(graphql_constants_1.GRAPHQL_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [modules_container_1.ModulesContainer, Object])
], ScalarsExplorerService);
exports.ScalarsExplorerService = ScalarsExplorerService;
