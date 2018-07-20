"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const mocks = {
    call: sinon.stub(),
};
const reset = function () {
    mocks.call.resetHistory();
};
const instance = class {
    call(...args) {
        mocks.call(args);
        return;
    }
};
exports.default = { mocks, instance, reset };
//# sourceMappingURL=logger.js.map