"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execution_context_host_1 = require("@nestjs/core/helpers/execution-context-host");
class GqlExecutionContext extends execution_context_host_1.ExecutionContextHost {
    static create(context) {
        const type = context.getType();
        const gqlContext = new GqlExecutionContext(context.getArgs(), context.getClass(), context.getHandler());
        gqlContext.setType(type);
        return gqlContext;
    }
    getRoot() {
        return this.getArgByIndex(0);
    }
    getArgs() {
        return this.getArgByIndex(1);
    }
    getContext() {
        return this.getArgByIndex(2);
    }
    getInfo() {
        return this.getArgByIndex(3);
    }
}
exports.GqlExecutionContext = GqlExecutionContext;
