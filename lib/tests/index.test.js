"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const index_1 = require("../index");
const logHandler_1 = require("../logHandler");
const assert = chai.assert;
suite('Test Plugin', () => {
    test('index returns logHandler', () => {
        const config = { reporters: [] };
        const logHandlerClass = logHandler_1.default.factory(config);
        const plugin = index_1.default(config);
        assert.hasAllDeepKeys(plugin, logHandlerClass.getLogHandler());
    });
});
//# sourceMappingURL=index.test.js.map