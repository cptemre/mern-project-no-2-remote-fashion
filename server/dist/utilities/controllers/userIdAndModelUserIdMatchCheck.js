"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ERRORS
const errors_1 = require("../../errors");
// ! PARAMS CHANGED - THERE MAY BE PROBLEMS
const userIdAndModelUserIdMatchCheck = ({ userType, userId, reqUserId, }) => {
    if (!userType || !userId || !reqUserId)
        throw new errors_1.UnauthorizedError("access denied");
    const userIdString = userId.toString();
    const reqUserIdString = reqUserId.toString();
    if (userType === "user" && userIdString !== reqUserIdString)
        throw new errors_1.UnauthorizedError("user id does not match");
    if (userType === "seller" && userIdString !== reqUserIdString)
        throw new errors_1.UnauthorizedError("seller id does not match");
    else
        return;
};
exports.default = userIdAndModelUserIdMatchCheck;
