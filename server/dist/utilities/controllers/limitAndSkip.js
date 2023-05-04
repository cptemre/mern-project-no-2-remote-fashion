"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const limitAndSkip = ({ limit, page }) => {
    let newPage = page || 1;
    if (newPage <= 0)
        throw new errors_1.BadRequestError("page value can not be less than 1");
    const pageToSkip = newPage ? newPage - 1 : 0;
    const skip = limit * pageToSkip;
    return { limit, skip };
};
exports.default = limitAndSkip;
