"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const limitAndSkip = ({ limit, page }) => {
    if (page && page < 1)
        throw new errors_1.BadRequestError("page value can not be less than 1");
    const pageToSkip = page ? page - 1 : 0;
    const skip = limit * pageToSkip;
    return { limit, skip };
};
exports.default = limitAndSkip;
