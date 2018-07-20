"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const strEnumHelper_1 = require("./helpers/strEnumHelper");
exports.LogLevels = strEnumHelper_1.strEnumHelper(['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug']);
exports.LogLevelsKeys = lodash.values(exports.LogLevels);
//# sourceMappingURL=interfaces.js.map