"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const modules_container_1 = require("@nestjs/core/injector/modules-container");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const lodash_1 = require("lodash");
const graphql_constants_1 = require("../graphql.constants");
const extract_metadata_util_1 = require("../utils/extract-metadata.util");
const base_explorer_service_1 = require("./base-explorer.service");
let DelegatesExplorerService = class DelegatesExplorerService extends base_explorer_service_1.BaseExplorerService {
    constructor(modulesContainer, metadataScanner, gqlOptions) {
        super();
        this.modulesContainer = modulesContainer;
        this.metadataScanner = metadataScanner;
        this.gqlOptions = gqlOptions;
    }
    explore() {
        const modules = this.getModules(this.modulesContainer, this.gqlOptions.include || []);
        const delegates = this.flatMap(modules, instance => this.filterDelegates(instance));
        return this.curryDelegates(this.groupMetadata(delegates));
    }
    filterDelegates(wrapper) {
        const { instance } = wrapper;
        if (!instance) {
            return undefined;
        }
        const prototype = Object.getPrototypeOf(instance);
        const predicate = (resolverType, isDelegated) => !isDelegated;
        const resolvers = this.metadataScanner.scanFromPrototype(instance, prototype, name => extract_metadata_util_1.extractMetadata(instance, prototype, name, predicate));
        return resolvers
            .filter(resolver => !!resolver)
            .map(resolver => {
            const callback = instance[resolver.methodName].bind(instance);
            return Object.assign(Object.assign({}, resolver), { callback });
        });
    }
    curryDelegates(delegates) {
        return mergeInfo => lodash_1.mapValues(delegates, parent => lodash_1.mapValues(parent, (propertyFn, key) => propertyFn()(mergeInfo)));
    }
};
DelegatesExplorerService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(2, common_1.Inject(graphql_constants_1.GRAPHQL_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [modules_container_1.ModulesContainer,
        metadata_scanner_1.MetadataScanner, Object])
], DelegatesExplorerService);
exports.DelegatesExplorerService = DelegatesExplorerService;
