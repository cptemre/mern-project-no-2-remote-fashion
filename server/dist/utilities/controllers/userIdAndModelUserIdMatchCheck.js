"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ERRORS
const errors_1 = require("../../errors");
const userIdAndModelUserIdMatchCheck = ({ user, userId, }) => {
    if ((user === null || user === void 0 ? void 0 : user.userType) === "user" && userId !== (user === null || user === void 0 ? void 0 : user._id))
        throw new errors_1.UnauthorizedError("user id does not match");
    if ((user === null || user === void 0 ? void 0 : user.userType) === "seller" && userId !== (user === null || user === void 0 ? void 0 : user._id))
        throw new errors_1.UnauthorizedError("seller id does not match");
    else
        return;
};
exports.default = userIdAndModelUserIdMatchCheck;
