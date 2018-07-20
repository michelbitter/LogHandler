"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const stub = {
    log: sinon.stub(),
};
const reset = () => {
    stub.log.reset();
};
class Instance {
    constructor() {
        this.name = 'Test Reporter';
    }
    async log(...args) {
        stub.log(args);
        return 'normal';
    }
}
exports.Instance = Instance;
exports.default = { Instance, stub, reset };
//# sourceMappingURL=reporter.js.map