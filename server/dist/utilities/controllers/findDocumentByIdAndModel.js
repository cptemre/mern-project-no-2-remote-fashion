"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// ERROR
const errors_1 = require("../../errors");
const findDocumentByIdAndModel = ({ id, user, seller, MyModel, }) => __awaiter(void 0, void 0, void 0, function* () {
    // ! QUERY IS ADDED LATER.
    // QUERY FOR FINDING THE DOCUMENT
    const query = {};
    if (id)
        query._id = id;
    if (user)
        query.user = user;
    if (seller)
        query.seller = seller;
    // FIND THE DOCUMENT
    const document = yield MyModel.findOne(query);
    // IF DOCUMENT DOES NOT EXIST SEND AN ERROR
    if (!document)
        throw new errors_1.BadRequestError("document does not exist");
    return document;
});
exports.default = findDocumentByIdAndModel;
