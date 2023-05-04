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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const currencyExchangeRates_1 = __importDefault(require("../payment/currencyExchangeRates"));
const findDocumentByIdAndModel_1 = __importDefault(require("./findDocumentByIdAndModel"));
const priceAndExchangedPriceCompare = ({ amount, price, tax, productId, currency, Product, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!amount || !price || !tax || !productId || !currency || !Product)
        throw new errors_1.BadRequestError("invalid credientals");
    let exchangedPrice = price;
    // FIND THE DOCUMENT OF PRODUCT
    const product = yield (0, findDocumentByIdAndModel_1.default)({
        id: productId,
        MyModel: Product,
    });
    if (amount > product.stock)
        throw new errors_1.BadRequestError("order amount can not be more than product stock");
    // IF CURRENCY IS ANOTHER THAN gbp GET EXCHANGE VALUE
    if (currency.toUpperCase() !== "GBP") {
        // CURRENCY CHANGE TO GBP
        const exchangedValue = yield (0, currencyExchangeRates_1.default)({
            from: "GBP",
            to: currency.toUpperCase(),
            amount: product.price,
        });
        // IF THERE IS A NUMBER VALUE THEN SET IT EQUAL TO SUBTOTAL
        // FROM NOW ON IN THIS CONTROLLER VALUES ARE IN GBP CURRENCY
        if (exchangedValue)
            exchangedPrice = exchangedValue;
    }
    if (price !== exchangedPrice)
        throw new errors_1.BadRequestError("requested price is not correct");
    if (tax !== product.tax)
        throw new errors_1.BadRequestError("requested tax is not correct");
    return;
});
exports.default = priceAndExchangedPriceCompare;
