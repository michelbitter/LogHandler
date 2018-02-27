"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const mocks = {
    Call: sinon.stub(),
    constructor: sinon.stub(),
};
const restore = function () {
    mocks.constructor.reset();
    mocks.Call.resetHistory();
};
const instance = class {
    constructor(...args) {
        this.LogLevels = [
            'emerg',
            'alert',
            'crit',
            'err',
            'warning',
            'notice',
            'info',
            'debug',
        ];
        mocks.constructor(args);
    }
    Call(...args) {
        mocks.Call(args);
        return;
    }
};
module.exports = { mocks, instance, restore };
//# sourceMappingURL=Logger.js.map