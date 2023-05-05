"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recievedMsg = exports.orderInformationArray = exports.cargoInformationArray = exports.sellerInformationArray = void 0;
const recievedMsg = "order recieved";
exports.recievedMsg = recievedMsg;
const warehouseMsg = "packaging in the warehouse";
const deliveredToTheCargoCompanyMsg = "delivered to the cargo company";
const deliveredToTheCourierMsg = "delivered to the courier";
const deliveredToTheBuyerMsg = "delivered to the buyer";
const deliveredToTheSellerMsg = "delivered to the seller";
const sellerInformationArray = [
    recievedMsg,
    warehouseMsg,
    deliveredToTheCargoCompanyMsg,
];
exports.sellerInformationArray = sellerInformationArray;
const cargoInformationArray = [
    deliveredToTheCargoCompanyMsg,
    deliveredToTheCourierMsg,
    deliveredToTheBuyerMsg,
];
exports.cargoInformationArray = cargoInformationArray;
const cancelInformationArray = [
    deliveredToTheBuyerMsg,
    deliveredToTheCargoCompanyMsg,
    deliveredToTheCourierMsg,
    deliveredToTheSellerMsg,
];
const orderInformationArray = [
    ...sellerInformationArray,
    ...cargoInformationArray,
    ...cancelInformationArray,
];
exports.orderInformationArray = orderInformationArray;
