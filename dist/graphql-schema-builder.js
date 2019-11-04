"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const services_1 = require("./services");
const lazy_metadata_storage_1 = require("./storages/lazy-metadata.storage");
let GraphQLSchemaBuilder = class GraphQLSchemaBuilder {
    constructor(scalarsExplorerService) {
        this.scalarsExplorerService = scalarsExplorerService;
    }
    build(autoSchemaFile, options = {}, resolvers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            lazy_metadata_storage_1.lazyMetadataStorage.load();
            const buildSchema = this.loadBuildSchemaFactory();
            const scalarsMap = this.scalarsExplorerService.getScalarsMap();
            try {
                return yield buildSchema(Object.assign(Object.assign({}, options), { emitSchemaFile: autoSchemaFile !== true ? autoSchemaFile : false, scalarsMap, validate: false, resolvers }));
            }
            catch (err) {
                if (err && err.details) {
                    console.error(err.details);
                }
                throw err;
            }
        });
    }
    loadBuildSchemaFactory() {
        const { buildSchema } = load_package_util_1.loadPackage('type-graphql', 'SchemaBuilder', () => require('type-graphql'));
        return buildSchema;
    }
};
GraphQLSchemaBuilder = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [services_1.ScalarsExplorerService])
], GraphQLSchemaBuilder);
exports.GraphQLSchemaBuilder = GraphQLSchemaBuilder;
