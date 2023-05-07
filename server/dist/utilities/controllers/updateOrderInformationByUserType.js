"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const categories_1 = require("../categories");
const updateOrderInformationByUserType = ({ orderInformation, singleOrderInformationValue, informationArray, status, }) => {
    // CHECK IF ORDER INFORMATION VALUE IS VALID VALUE
    if (!informationArray.includes(orderInformation))
        throw new errors_1.BadRequestError(`${orderInformation} is not accepted as an information`);
    // GET THE INDEX VALUE OF ACTUAL ORDER INFORMATION IN SINGLE ORDER DOCUMENT
    const indexOfSingleOrderInformationValue = informationArray.indexOf(singleOrderInformationValue);
    // GET THE INDEX ORDER OF CLIENT SIDE ORDER INFORMATION
    const indexOfClientOrderInformation = informationArray.indexOf(orderInformation);
    // COMPARE TWO INDEXES AND IF NEW VALUE INDEX IS NOT FOLLOWING THE PREVIOUS ONE THEN THROW A NEW ERROR
    if (indexOfSingleOrderInformationValue + 1 !== indexOfClientOrderInformation)
        throw new errors_1.BadRequestError("information order is not correct");
    // * STATUS CHECK BEGINS
    // IF IT IS NOT THE LAST MESSAGE IN THE ARRAY THEN RETURN THE SAME STATUS
    if (informationArray[indexOfClientOrderInformation] !==
        informationArray[informationArray.length - 1])
        return { status };
    // IF IT IS LAST MESSAGE IN THE ARRAY AND IF THE STATUS IS NOT CANCELED THEN RETURN THE NEXT STATUS FROM THE ORDER STATUS VALUES ARRAY
    // GET THE INDEX OF CURRENT STATUS FROM THE ORDER STATUS VALUES ARRAY
    const indexOfStatus = categories_1.orderStatusValues.indexOf(status);
    // GET THE NEW STATUS BY ADDING THE INDEX +1
    const newStatus = categories_1.orderStatusValues[indexOfStatus + 1];
    console.log({ newStatus });
    // IF THERE IS NO SUCH STATUS THEN THROW AN ERROR
    if (!newStatus)
        throw new errors_1.BadRequestError("status is not correct");
    // DATES TO DETERMINE STATUS CHANGE DATE
    const isDeliveryToCargo = newStatus === "cargo";
    const isDeliveryToUser = newStatus === "delivered";
    const isCancelation = newStatus === "canceled";
    // RETURN NEW STATUS
    return {
        status: newStatus,
        isDeliveryToCargo,
        isDeliveryToUser,
        isCancelation,
    };
};
exports.default = updateOrderInformationByUserType;
