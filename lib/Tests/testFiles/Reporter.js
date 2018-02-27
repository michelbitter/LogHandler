"use strict";
module.exports = () => {
    const sinon = require('sinon');
    const Stub = {
        Log: sinon.stub(),
    };
    const Reset = () => {
        Stub.Log.reset();
    };
    class Instance {
        constructor() {
            this.Name = 'Test Reporter';
        }
        async Log(...args) {
            Stub.Log(args);
            return;
        }
    }
    return { Instance, Stub, Reset };
};
//# sourceMappingURL=Reporter.js.map