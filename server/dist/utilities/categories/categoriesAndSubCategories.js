"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSubCategories = exports.categoriesAndSubCategories = void 0;
const categoriesAndSubCategories = {
    clothes: [
        "beachwear",
        "coats and jackets",
        "hoodies and sweatshirts",
        "jeans",
        "shorts",
        "sportswear",
        "suits",
    ],
    shoes: ["brogues", "flats", "heels", "loafers", "trainers"],
};
exports.categoriesAndSubCategories = categoriesAndSubCategories;
// CONCAT ALL SUB_CATEGORIES WITH A LOOP
const allSubCategories = [];
exports.allSubCategories = allSubCategories;
// LOOP THE OBJECT AND PUSH ALL VALUES TO ARRAY TO GATHER THEM ALL IN A SINGLE ARRAY
Object.keys(categoriesAndSubCategories).forEach((key) => {
    allSubCategories.push(...categoriesAndSubCategories[key]);
});
