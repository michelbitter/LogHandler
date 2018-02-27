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
            this.TimeOut = 10;
        }
        Log(...args) {
            return new Promise((res, rej) => {
                Stub.Log(args);
                setTimeout(() => {
                    res('PROMISE GELUKT');
                }, 5000);
            });
        }
    }
    return { Instance, Stub, Reset };
};
//# sourceMappingURL=ReporterTimeOut.js.map