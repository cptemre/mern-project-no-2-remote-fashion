"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const cardInfoSplitter = ({ card }) => {
    // SPLIT THE CARD QUERY TO "cardNumber", "expMonth", "expDate", "cvc" AND ITS VALUES AS AN ARRAY
    // EXAMPLE: ['cvc=000',......]
    const cardInfos = card.split("_");
    // ARRAY INSIDE ARRAY
    // EXAMPLE AFTER LOOP [['cvc','000'],......]
    let splittedInfos = [];
    for (let i = 0; i < cardInfos.length; i++)
        splittedInfos = [...splittedInfos, splitCardInfos(cardInfos[i])];
    // KEY VALUE OBJECT FOR CARD INFO KEY IN USER MODEL
    const cardInfo = {};
    for (let i = 0; i < splittedInfos.length; i++) {
        const [key, value] = splittedInfos[i];
        cardInfo[key] = value;
    }
    return { cardInfo };
};
const splitCardInfos = (info) => {
    const cardInfokeys = ["cardNumber", "expMonth", "expDate", "cvc"];
    const splittedInfo = info.split("-");
    if (!cardInfokeys.includes(splittedInfo[0]))
        throw new errors_1.BadRequestError("card info is wrong");
    return splittedInfo;
};
exports.default = cardInfoSplitter;
