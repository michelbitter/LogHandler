"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rollbar = require("rollbar");
class RollbarReporter {
    constructor(settings) {
        this.name = 'Rollbar reporter';
        this.timeOut = 10000;
        this.settings = settings;
        this.Rollbar = new Rollbar(settings);
    }
    async log(obj) {
        await new Promise((resolve, reject) => {
            if (this.settings.enabled && this.has2Ignore(obj.level, this.settings.reportLevel)) {
                const lvl = this.GetRollBarLvl(obj.level);
                let request = null;
                if (obj.data._request) {
                    request = obj.data._request;
                    if (obj.data._user) {
                        request = Object.assign({}, request, { user: obj.data._person });
                    }
                    if (obj.data._userId) {
                        request = Object.assign({}, request, { userId: obj.data._userId });
                    }
                }
                const custom = {
                    args: obj.args,
                    data: Object.assign({}, obj.data, { _request: undefined, _user: undefined, _userId: undefined }),
                    date: obj.createdAt,
                    lvl: obj.level,
                };
                const callback = (err) => (err ? reject(err) : resolve());
                if (request) {
                    this.Rollbar[lvl](obj.error, request, custom, callback);
                }
                else {
                    this.Rollbar[lvl](obj.error, custom, callback);
                }
            }
            else {
                resolve();
            }
        });
    }
    GetRollBarLvl(lvl) {
        switch (lvl) {
            case 0:
            case 1:
            case 2:
                return 'critical';
            case 3:
                return 'error';
            case 4:
                return 'warning';
            case 5:
            case 6:
                return 'info';
            case 7:
                return 'debug';
        }
        throw new Error(`Couldn't send log item to rollbar. Can't determine which rollbar loglvl matches LogHandlers loglvl "${lvl}"`);
    }
    has2Ignore(lvl, rollbarLevels) {
        switch (rollbarLevels) {
            case 'critical':
                return lvl <= 2;
            case 'debug':
                return false;
            case 'error':
                return lvl <= 3;
            case 'info':
                return lvl <= 6;
            case 'warning':
                return lvl <= 5;
            default:
                return false;
        }
    }
}
exports.RollbarReporter = RollbarReporter;
//# sourceMappingURL=index.js.map