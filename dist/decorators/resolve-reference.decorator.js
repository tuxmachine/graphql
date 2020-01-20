"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_constants_1 = require("../graphql.constants");
const common_1 = require("@nestjs/common");
function ResolveReference() {
    return (target, key, descriptor) => {
        common_1.SetMetadata(graphql_constants_1.RESOLVER_REFERENCE_METADATA, true)(target, key, descriptor);
    };
}
exports.ResolveReference = ResolveReference;
