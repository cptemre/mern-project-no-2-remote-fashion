"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserTypeQuery = ({ userType, id, }) => {
    // CHECK USER TYPE TO GET PROPER OBJECT
    const userTypeQuery = {};
    const stringId = id.toString();
    if (userType === "user")
        userTypeQuery.user = stringId;
    if (userType === "seller")
        userTypeQuery.seller = stringId;
    if (userType === "courier")
        userTypeQuery.courier = stringId;
    return { userTypeQuery };
};
exports.default = getUserTypeQuery;
