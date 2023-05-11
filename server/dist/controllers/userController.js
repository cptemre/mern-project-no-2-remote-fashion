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
exports.updateUser = exports.deleteUser = exports.showCurrentUser = exports.getSingleUser = exports.getAllUsers = void 0;
// MODELS
const models_1 = require("../models");
// STATUS CODES
const http_status_codes_1 = require("http-status-codes");
// FIND DOCUMENT
const controllers_1 = require("../utilities/controllers");
const errors_1 = require("../errors");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // BODY FROM THE CLIENT
    const { name, surname, email, userType, country, isVerified, userPage, } = req.body;
    // QUERY OBJECT TO FIND NEEDED USERS
    const query = {};
    // SET QUERY KEYS
    if (name)
        query.name = (0, controllers_1.createMongooseRegex)(name);
    if (surname)
        query.surname = (0, controllers_1.createMongooseRegex)(surname);
    if (email)
        query.email = (0, controllers_1.createMongooseRegex)(email);
    if (userType)
        query.userType = userType;
    if (country)
        query.country = country;
    if (isVerified)
        query.isVerified = isVerified;
    // LIMIT AND SKIP VALUES
    const myLimit = 20;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: userPage });
    // GET USERS
    const result = models_1.User.find(query).select("-password -passwordToken");
    console.log(query);
    const users = yield result.skip(skip).limit(limit);
    // SEND BACK FETCHED USERS
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "users fetched", users });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET USER ID FROM PARAMS
    const { id: userId } = req.params;
    // GET THE USER FROM DB
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
        MyModel: models_1.User,
    });
    // HIDE USER PASSWORD BEFORE SENDING IT TO THE CLIENT
    user.password = "";
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user fetched", user });
});
exports.getSingleUser = getSingleUser;
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "current user fetched", user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET USER ID FROM PARAMS
    const { id: userId } = req.params;
    // CHECK IF THE USER HAS PERMISSION TO GET THE USER.
    // HAS TO BE SAME USER OR AN ADMIN TO DO THAT
    // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    const { userType: reqUserType, _id: reqUserId } = req.user;
    (0, controllers_1.userIdAndModelUserIdMatchCheck)({
        userType: reqUserType,
        userId,
        reqUserId,
    });
    // CHECK IF THE USER EXISTS
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
        MyModel: models_1.User,
    });
    // SET THE USER PASSWORD TO EMPTY BEFORE SENDING IT TO THE CLIENT
    user.password = "";
    // DELETE THE USER
    yield models_1.User.findOneAndDelete({ _id: userId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user deleted", user });
});
exports.deleteUser = deleteUser;
// ! BEFORE UPDATE CLIENT SHOULD ASK FOR PASSWORD CHECK
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET USER ID FROM PARAMS
    const { id: userId } = req.params;
    // GET UPDATED VALUES FROM THE CLIENT
    const { name, surname, userType, phoneNumber, address, cardInfo, avatar, cartItems, accountNo, } = req.body;
    // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    const { userType: reqUserType, _id: reqUserId } = req.user;
    (0, controllers_1.userIdAndModelUserIdMatchCheck)({ userType: reqUserType, userId, reqUserId });
    // CHECK IF THE USER EXISTS
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
        user: userId,
        MyModel: models_1.User,
    });
    // MAIN INFO UPDATE
    if (name)
        user.name = name;
    if (surname)
        user.surname = surname;
    if (userType)
        user.userType = userType;
    if (address)
        user.address = address;
    if (phoneNumber)
        user.phoneNumber = phoneNumber;
    if (cardInfo)
        user.cardInfo = cardInfo;
    if (avatar)
        user.avatar = avatar;
    if (accountNo)
        user.accountNo = accountNo;
    // CART ITEMS UPDATE
    // CHECK IF PRICE, TAX AND USER MATCHES WITH THE ACTUAL PRODUCT VALUES
    if (cartItems && cartItems.length) {
        // ONLY ADMIN AND USER CAN SET CART ITEMS FOR USER
        if (reqUserType === "seller" || reqUserType === "courier")
            throw new errors_1.UnauthorizedError("authorization denied");
        for (let i = 0; i < cartItems.length; i++) {
            const { name, amount, price, tax, product, currency, status, user } = cartItems[i];
            //
            if (!name ||
                !amount ||
                !price ||
                !tax ||
                !product ||
                !currency ||
                !status ||
                !user)
                throw new errors_1.BadRequestError("invalid credentials");
            // IF USER IS NOT CART ITEM'S USER THEN THROW AN ERROR
            (0, controllers_1.userIdAndModelUserIdMatchCheck)({
                userType: reqUserType,
                userId: user,
                reqUserId,
            });
            if (status !== "pending")
                throw new errors_1.UnauthorizedError("status of the cart item is not correct");
            const productId = product.toString();
            // CHECK IF PRICE AND TAX FROM CLIENT MATCHES WITH DATABASE
            yield (0, controllers_1.priceAndExchangedPriceCompare)({
                amount,
                price,
                tax,
                productId,
                currency,
                Product: models_1.Product,
            });
        }
        // IF NO ERROR THROWN FROM FOR LOOP THEN ADD CART ITEMS TO THE USER
        user.cartItems = cartItems;
    }
    // SAVE THE USER
    yield user.save();
    // HIDE USER PASSWORD AND TOKENS BEFORE SENDING IT TO THE CLIENT
    user.password = "";
    user.verificationToken = "";
    user.passwordToken = "";
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user updated", user });
});
exports.updateUser = updateUser;
