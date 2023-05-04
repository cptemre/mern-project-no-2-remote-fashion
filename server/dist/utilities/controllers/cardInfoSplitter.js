"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const cardInfoSplitter = ({ card }) => {
    // SPLIT THE CARD QUERY TO "cardNumber", "expMonth", "expYear", "cvc" AND ITS VALUES AS AN ARRAY
    // EXAMPLE: ['cvc=000',......]
    const cardInfos = card.split("_");
    // ARRAY INSIDE ARRAY
    // EXAMPLE AFTER LOOP [['cvc','000'],......]
    let splittedInfos = [];
    for (let i = 0; i < cardInfos.length; i++)
        splittedInfos = [...splittedInfos, splitCardInfos(cardInfos[i])];
    // KEY VALUE OBJECT FOR CARD INFO KEY IN USER MODEL
    const cardInfo = {
        cardNumber: "",
        expMonth: undefined,
        expYear: undefined,
        cvc: "",
    };
    for (let i = 0; i < splittedInfos.length; i++) {
        const [key, value] = splittedInfos[i];
        cardInfo[key] = value;
    }
    const { cardNumber, expMonth, expYear, cvc } = cardInfo;
    if (cardNumber && expMonth && expYear && cvc)
        return cardInfo;
    else
        throw new errors_1.BadRequestError("card information values are not provided correctly");
};
const splitCardInfos = (info) => {
    const cardInfokeys = ["cardNumber", "expMonth", "expYear", "cvc"];
    const splittedInfo = info.split("-");
    if (!cardInfokeys.includes(splittedInfo[0]))
        throw new errors_1.BadRequestError("card info is wrong");
    return splittedInfo;
};
exports.default = cardInfoSplitter;
