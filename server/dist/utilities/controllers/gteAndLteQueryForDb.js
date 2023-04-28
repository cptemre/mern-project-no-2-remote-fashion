"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gteAndLteQueryForDb = (price) => {
    // EXAMPLE: gte-50_lte-100
    const [gteString, lteString] = price.split("_");
    const priceVal = {
        $gte: undefined,
        $lte: undefined,
    };
    // ! CHANGE THIS IFS TO A FUNCTION TO NOT REPEAT
    if (gteString && gteString.startsWith("gte-")) {
        // EXAMPLE: [gte,50]
        const gte = gteString.split("-");
        // EXAMPLE: 50
        let gteVal = Number(gte[1]);
        // {$gte: 50}
        priceVal.$gte = gteVal;
    }
    if (lteString && lteString.startsWith("lte-")) {
        // EXAMPLE: [lte,100]
        const lte = lteString.split("-");
        // EXAMPLE: 100
        let lteVal = Number(lte[1]);
        // {$lte: 100}
        priceVal.$lte = lteVal;
    }
    return priceVal;
};
exports.default = gteAndLteQueryForDb;
