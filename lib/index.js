"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logHandler_1 = require("./logHandler");
const interfaces_1 = require("./interfaces");
const logHandler = function (config) {
    return logHandler_1.LogHandler.factory(config).getLogHandler();
};
exports.default = logHandler;
exports.logLevelsKeys = interfaces_1.LogLevelsKeys;
//# sourceMappingURL=index.js.map