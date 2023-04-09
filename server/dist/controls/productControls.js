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
exports.updateProduct = exports.getSingleProduct = exports.deleteProduct = exports.getAllProducts = exports.createProduct = void 0;
// MODELS
const models_1 = require("../models");
// ARRAYS
const categoriesAndSubCategories_1 = require("../utilities/categories/categoriesAndSubCategories");
// HTTP CODES
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE BODY REQUEST TO CREATE A PRODUCT
    const { name, brand, price, image, description, size, gender, category, subCategory, } = req.body;
    const stock = Number(req.body.stock) || 0;
    // CHECK IF ALL NECESSARY CREDENTIALS ARE PROVIDED
    if (!name ||
        !brand ||
        !price ||
        !image ||
        !description ||
        !size ||
        !gender ||
        !category ||
        !subCategory)
        throw new errors_1.BadRequestError("missing credentials");
    // IMAGE ARRAY LENGTH CAN NOT BE MORE THAN 5
    if (image.length > 5)
        throw new errors_1.BadRequestError("max image files for a product is 5");
    // DESCRIPTION ARRAY LENGTH CAN NOT BE MORE THAN 6
    if (description.length > 6)
        throw new errors_1.BadRequestError("max description list length for a product is 6");
    // ONE DESCRIPTION LENGTH ERROR
    for (let i = 0; i < description.length; i++) {
        if (description[i].length > 24)
            throw new errors_1.BadRequestError("a description can not be longer than 24 characters");
    }
    // CHECK IF CATEGORY MATCHES WITH THE SUB-CATEGORY
    if (!categoriesAndSubCategories_1.categoriesAndSubCategories[category].includes(subCategory))
        throw new errors_1.BadRequestError("sub-category does not match with the category");
    // CHECK IF THE PRODUCT WITH THE SAME NAME AND BRAND EXISTS
    const product = yield models_1.Product.findOne({ name, brand });
    if (product)
        throw new errors_1.UnauthorizedError("product already exists");
    // CREATE A UNIQUE NEW PRODUCT
    const newProduct = yield models_1.Product.create({
        name,
        brand,
        price,
        image,
        description,
        size,
        gender,
        category,
        subCategory,
        stock,
    });
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ msg: "product created", product: newProduct });
});
exports.createProduct = createProduct;
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
        const [gteString, lteString] = price.split("_");
        const priceVal = {
            $gte: undefined,
            $lte: undefined,
        };
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
    }
    // ! CHECK HERE AFTER REVIEW MODEL CREATED
    // if (isReview) query.isReview = isReview === "true";
    if (isStock === "true")
        query.stock = { $gt: 0 };
    if (rating)
        query.rating = Number(rating);
    if (gender)
        query.gender = gender;
    if (page)
        query.page = Number(page);
    else
        query.page = 1;
    const limit = 10;
    const skip = limit * (Number(page) - 1);
    const findProducts = models_1.Product.find(query);
    const products = yield findProducts.skip(skip).limit(limit);
    const productLength = products.length;
    res.status(http_status_codes_1.StatusCodes.OK).json({ products, productLength });
});
exports.getAllProducts = getAllProducts;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET PRODUCT ID FROM BODY
    const { id: productId } = req.params;
    // FIND THE PRODUCT
    const product = yield findProductById(productId);
    // DELETE THE PRODUCT
    yield product.deleteOne();
    // ! AFTER DELETING PRODUCT DELETE ALL REVIEWS IN THE FUTURE
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "product deleted" });
});
exports.deleteProduct = deleteProduct;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET PRODUCT ID FROM BODY
    const { id: productId } = req.params;
    // FIND THE PRODUCT
    const product = yield findProductById(productId);
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.getSingleProduct = getSingleProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET PRODUCT ID FROM BODY
    const { id: productId } = req.params;
    const { name, brand, price, image, description, size, gender, category, subCategory, stock, } = req.body;
    // FIND THE PRODUCT
    const product = yield findProductById(productId);
    // UPDATE PROPERTIES
    if (name)
        product.name = name;
    if (brand)
        product.brand = brand;
    if (price)
        product.price = Number(price);
    if (image)
        product.image = image;
    if (description)
        product.description = description;
    if (gender)
        product.gender = gender;
    if (category)
        product.category = category;
    if (subCategory)
        product.subCategory = subCategory;
    if (stock)
        product.stock = stock;
    // SAVE UPDATED PRODUCT
    yield product.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "product updated", product });
});
exports.updateProduct = updateProduct;
const findProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    // FIND THE PRODUCT
    const product = yield models_1.Product.findOne({ _id: productId });
    // IF PRODUCT DOES NOT EXIST SEND AN ERROR
    if (!product)
        throw new errors_1.BadRequestError("product does not exist");
    return product;
});
