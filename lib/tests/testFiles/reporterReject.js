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
        this.name = 'Test Reject Reporter';
        this.timeOut = 5;
    }
    log(...args) {
        throw new Error('something terible goes wrong!');
    }
}
exports.Instance = Instance;
exports.default = { Instance, stub, reset };
//# sourceMappingURL=reporterReject.js.map