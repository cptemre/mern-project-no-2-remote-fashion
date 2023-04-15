"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ERRORS
const errors_1 = require("../../errors");
const userIdAndModelUserIdMatchCheck = ({ user, userId, }) => {
    if ((user === null || user === void 0 ? void 0 : user.userType) !== "admin" && userId !== (user === null || user === void 0 ? void 0 : user._id))
        throw new errors_1.UnauthorizedError("authorization failed");
};
exports.default = userIdAndModelUserIdMatchCheck;
