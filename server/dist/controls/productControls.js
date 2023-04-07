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
// MODELS
const models_1 = require("../models");
// HTTP CODES
const http_status_codes_1 = require("http-status-codes");
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // QUERY FROM THE CLIENT
    const { name, brand, color, size, price, isReview, isStock, rating, gender, page, } = req.body;
    // EMPTY QUERY IN SERVER TO SET VALUES
    const query = {};
    if (name)
        query.name = name;
    if (brand)
        query.brand = brand;
    if (color)
        query.color = color;
    if (size)
        query.size = size;
    if (price) {
        // EXAMPLE: gte-50_lte-100
        let splitPrice = price.split("_");
        let gteVal;
        const priceVal = {
            $gte: undefined,
            $lte: undefined,
        };
        if (splitPrice[0] && splitPrice[0].startsWith("gte-")) {
            // EXAMPLE: [gte,50]
            const gte = splitPrice[0].split("-");
            // EXAMPLE: 50
            let gteVal = Number(gte[1]);
            // {$gte: 50}
            priceVal.$gte = gteVal;
        }
        if (splitPrice[0] && splitPrice[1].startsWith("lte-")) {
            // EXAMPLE: [lte,100]
            const lte = splitPrice[1].split("-");
            // EXAMPLE: 100
            let lteVal = Number(lte[1]);
            // {$lte: 100}
            priceVal.$lte = lteVal;
        }
    }
    if (isReview)
        query.isReview = isReview === "true";
    if (isStock)
        query.isStock = isStock === "true";
    if (rating)
        query.rating = Number(rating);
    if (gender)
        query.gender = gender;
    if (page)
        query.page = Number(page);
    else
        query.page = 1;
    const limit = 10;
    const skip = limit * (page - 1);
    const findProducts = models_1.Product.find({});
    const products = yield findProducts.skip(skip).limit(limit);
    res.status(http_status_codes_1.StatusCodes.OK).json({ products });
});
