"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logHandler_1 = require("./logHandler");
const logHandler = function (config) {
    return logHandler_1.logHandler.factory(config).getLogHandler();
};
exports.default = logHandler;
//# sourceMappingURL=index.js.map