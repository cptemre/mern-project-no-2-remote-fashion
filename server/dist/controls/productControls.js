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
// ERRORS
const errors_1 = require("../errors");
// UTILITY FUNCTIONS
const controllers_1 = require("../utilities/controllers");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE BODY REQUEST TO CREATE A PRODUCT
    const { name, brand, price, tax, image, description, size, gender, category, subCategory, } = req.body;
    const stock = Number(req.body.stock) || 0;
    // CHECK IF ALL NECESSARY CREDENTIALS ARE PROVIDED
    if (!name ||
        !brand ||
        !price ||
        !tax ||
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
        tax,
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
    var _a;
    // QUERY FROM THE CLIENT
    // !DONT FORGET TO SET ISREVIEW BOOL LATER
    const { name, brand, color, size, price, isReview, isStock, rating, gender, page, myProducts, } = req.body;
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
    if (price)
        query.price = (0, controllers_1.gteAndLteQueryForDb)(price);
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
    if (myProducts === "true")
        query.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // LIMIT AND SKIP VALUES
    const myLimit = 20;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: Number(page) });
    // FIND PRODUCTS
    const findProducts = models_1.Product.find(query);
    // LIMIT AND SKIP
    const products = yield findProducts.skip(skip).limit(limit);
    const productLength = products.length;
    res.status(http_status_codes_1.StatusCodes.OK).json({ products, productLength });
});
exports.getAllProducts = getAllProducts;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET PRODUCT ID FROM BODY
    const { id: productId } = req.params;
    // FIND THE PRODUCT
    const product = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: productId,
        MyModel: models_1.Product,
    });
    // DELETE THE PRODUCT
    yield models_1.Product.findOneAndDelete({ _id: productId });
    // ! AFTER DELETING PRODUCT DELETE ALL REVIEWS IN THE FUTURE
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "product deleted" });
});
exports.deleteProduct = deleteProduct;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET PRODUCT ID FROM BODY
    const { id: productId } = req.params;
    // FIND THE PRODUCT
    const product = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: productId,
        MyModel: models_1.Product,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.getSingleProduct = getSingleProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET PRODUCT ID FROM BODY
    const { id: productId } = req.params;
    const { name, brand, price, image, description, size, gender, category, subCategory, stock, } = req.body;
    // FIND THE PRODUCT
    const product = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: productId,
        MyModel: models_1.Product,
    });
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
    if (size)
        product.size = size;
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
