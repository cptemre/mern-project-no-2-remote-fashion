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
const axios_1 = __importDefault(require("axios"));
const currencyExchangeRates = ({ from, to, amount, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headers = {
            apikey: process.env.FIXER_API_KEY,
        };
        const response = yield axios_1.default.get("https://api.apilayer.com/fixer/convert", {
            headers,
            params: {
                to: to.toUpperCase(),
                from: from.toUpperCase(),
                amount,
            },
        });
        // THIS RETURNS THE CONVERTED VALUE OF NEW CURRENCY
        const exchangedValue = response.data.result;
        console.log(exchangedValue);
        if (exchangedValue)
            return exchangedValue;
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = currencyExchangeRates;
