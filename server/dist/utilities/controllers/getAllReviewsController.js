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
const http_status_codes_1 = require("http-status-codes");
const _1 = require(".");
const models_1 = require("../../models");
const getAllReviewsController = ({ userId, reviewPage, productId, res, }) => __awaiter(void 0, void 0, void 0, function* () {
    // FIND THE REVIEW
    if (productId) {
        yield (0, _1.findDocumentByIdAndModel)({
            id: productId,
            MyModel: models_1.Product,
        });
    }
    // FIND THE REVIEWS BY PRODUCT ID AND USER ID IF REQUIRED
    const query = {};
    if (productId)
        query.product = productId;
    if (userId)
        query.user = userId;
    // LIMIT AND SKIP VALUES
    const myLimit = 5;
    const { limit, skip } = (0, _1.limitAndSkip)({ limit: myLimit, page: reviewPage });
    const result = models_1.Review.find(query);
    const reviews = yield result.skip(skip).limit(limit);
    const length = yield models_1.Review.countDocuments(query);
    let msg;
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "reviews fetched", result: reviews, length });
});
exports.default = getAllReviewsController;
