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
        this.name = 'Test Timeout Reporter';
        this.timeOut = 5;
    }
    log(...args) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res('timeOut failed');
            }, 5000);
        });
    }
}
exports.Instance = Instance;
exports.default = { Instance, stub, reset };
//# sourceMappingURL=reporterTimeOut.js.map