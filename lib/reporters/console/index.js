"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors/safe");
class ConsoleReporter {
    constructor() {
        this.name = 'Console reporter';
        this.timeOut = 2500;
    }
    async log(obj) {
        const loglvl = [
            { color: colors.red, txt: 'emerg' },
            { color: colors.red, txt: 'alert' },
            { color: colors.magenta, txt: 'critical' },
            { color: colors.magenta, txt: 'error' },
            { color: colors.yellow, txt: 'warning' },
            { color: colors.green, txt: 'notice' },
            { color: colors.cyan, txt: 'info' },
            { color: colors.blue, txt: 'debug' },
        ];
        const lvlMsg = loglvl[obj.level].txt.toUpperCase();
        const timeMsg = `${obj.createdAt.toDateString()} ${obj.createdAt.toLocaleTimeString()}:`;
        const consoleMsg = `[${loglvl[obj.level].color(lvlMsg)}] ${colors.white(colors.italic(timeMsg))} ${colors.gray(obj.error.message)}`;
        console.error(consoleMsg, obj.level < 4 ? obj.error.stack : '', '\r\n');
    }
}
exports.ConsoleReporter = ConsoleReporter;
//# sourceMappingURL=index.js.map