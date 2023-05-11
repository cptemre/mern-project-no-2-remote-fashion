"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// SEARCH REGEX FUNCTION
const createMongooseRegex = (regex) => {
    const searchRegex = { $regex: `${regex}`, $options: "i" };
    return searchRegex;
};
exports.default = createMongooseRegex;
