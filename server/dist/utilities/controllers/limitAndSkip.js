"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const limitAndSkip = ({ limit, page }) => {
    const skip = limit * page ? page - 1 : 0;
    return { limit, skip };
};
exports.default = limitAndSkip;
