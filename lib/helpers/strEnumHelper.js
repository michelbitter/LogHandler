"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function strEnumHelper(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
exports.strEnumHelper = strEnumHelper;
//# sourceMappingURL=strEnumHelper.js.map