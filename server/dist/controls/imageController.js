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
exports.uploadImages = void 0;
const token_1 = require("../utilities/token");
const models_1 = require("../models");
const categories_1 = require("../utilities/categories");
// AWS S3 CLIENT
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
// ERROR
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
const controllers_1 = require("../utilities/controllers");
// BUCKET ENV VARIABLES
const bucket_name = process.env.BUCKET_NAME;
const bucket_region = process.env.BUCKET_REGION;
const bucket_access_key = process.env.BUCKET_ACCESS_KEY;
const bucket_secret_access_key = process.env.BUCKET_SECRET_ACCESS_KEY;
// CONNECT TO S3 BUCKET
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: bucket_access_key,
        secretAccessKey: bucket_secret_access_key,
    },
    region: bucket_region,
});
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // LEARN IF PRODUCT OR AVATAR IMAGE TYPE
    const { type } = req.body;
    // THROW AN ERROR IF THERE IS NO TYPE FROM THE CLIENT
    if (!type)
        throw new errors_1.BadRequestError("image type is required");
    // REQ FILES
    const productImagesFiles = req.files;
    // CHECK IF THERE ARE FILES
    if (!productImagesFiles)
        throw new errors_1.BadRequestError("there is no product image");
    // CHECK IF IT IS AN ARRAY
    if (!Array.isArray(productImagesFiles))
        throw new errors_1.BadRequestError("there is no image");
    // * MAX IMAGE LIMIT ERROR IS IN ERROR HANDLER FILE IN MIDDLEWARES FOLDER
    // THROW ERROR IF THE TYPE IS PRODUCT AND IMAGES ARE LESS THAN 2 OR THERE IS NO PRODUCT ID
    if (type === categories_1.imageUploadTypes[0] && productImagesFiles.length < 2)
        throw new errors_1.BadRequestError("minimum product image length is one");
    // AVATAR CAN BE ONLY ONE IMAGE IN THE ARRAY TO UPLOAD
    if (type === categories_1.imageUploadTypes[1] && productImagesFiles.length === 1)
        throw new errors_1.BadRequestError("you can not upload more than one avatar image");
    // USER MUST BE LOGGED IN
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    // ALL IMAGES AS DOCUMENTS
    let result = [];
    // LOOP THROUGH ALL FILES
    for (let i = 0; i < productImagesFiles.length; i++) {
        // FILE PROPERTIES
        const originalName = productImagesFiles[i].originalname;
        const mimeType = productImagesFiles[i].mimetype;
        const buffer = productImagesFiles[i].buffer;
        const size = productImagesFiles[i].size;
        const cryptoName = (0, token_1.createCrypto)();
        // FILE CAN NOT BE MORE THAN 500KB
        if (size > 500000)
            throw new errors_1.BadRequestError("maximum image size is 500kb");
        // FILE CAN ONLY BE IN JPEG FORMAT
        if (mimeType !== "image/jpeg")
            throw new errors_1.BadRequestError("image type must be jpeg");
        // COMMAND FOR S3
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucket_name,
            Key: cryptoName,
            Body: buffer,
            ContentType: mimeType,
        });
        // UPLOAD IMAGE
        yield s3.send(command);
        // CREATE AN IMAGE DOCUMENT
        const image = yield models_1.Image.create({
            originalName,
            cryptoName,
            mimeType,
            size,
            type,
        });
        // PUSH CREATED IMAGE DOCUMENT TO RESULT ARRAY
        result = [...result, image];
    }
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "images are uploaded", result });
});
exports.uploadImages = uploadImages;
const getSignedUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET IMAGE AND PRODUCT ID FROM CLIENT
    const { images, type, product: productId, } = req.body;
    // CHECK CREDENTIALS
    if (!images || !type)
        throw new errors_1.BadRequestError("invalid credentials");
    // USER MUST BE LOGGED IN
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    // USER TYPE AND ID
    const { userType, _id: reqUserId } = req.user;
    // CHECK TYPE PRODUCT
    let product;
    if (type === categories_1.imageUploadTypes[0]) {
        // GET PRODUCT DOCUMENT
        product = yield (0, controllers_1.findDocumentByIdAndModel)({
            id: productId,
            MyModel: models_1.Product,
        });
        // CHECK IF SELLER AND PRODUCT SELLER MATCH
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({ userType, userId: productId, reqUserId });
    }
    // CHECK TYPE PRODUCT
    let user;
    if (type === categories_1.imageUploadTypes[1])
        // GET PRODUCT DOCUMENT
        user = yield (0, controllers_1.findDocumentByIdAndModel)({
            id: reqUserId,
            MyModel: models_1.User,
        });
    // RESULT ARRAY
    let result = [];
    // LOOP THROUGH IMAGE CRYPTO NAMES TO GET SIGNED URL FROM AWS S3
    for (let i = 0; i < images.length; i++) {
        // GET IMAGE DOCUMENT
        const image = yield (0, controllers_1.findDocumentByIdAndModel)({
            id: images[i],
            MyModel: models_1.Image,
        });
        // COMPARE IMAGE DOCUMENT TYPE AND PROVIDED TYPE TO COMPARE IF IT BELONGS TO PRODUCT OR AVATAR
        if (image.type !== type)
            throw new errors_1.BadRequestError("image type does not match");
        // GET COMMAND WITH BUCKET NAME AND CRYPO NAME
        const command = new client_s3_1.GetObjectCommand({
            Bucket: bucket_name,
            Key: image.cryptoName,
        });
        // GET URL
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command);
        // PUSH URL TO RESULT ARRAY
        result = [...result, signedUrl];
    }
    // IF PRODUCT DOCUMENT EXISTS
    if (product) {
        // WRITE THE SIGNED URL IN THE PRODUCT
        product.images = result;
        // SAVE PRODUCT TO DOCUMENT
        yield product.save();
    }
    // IF USER DOCUMENT EXISTS
    if (user) {
        // WRITE THE SIGNED URL IN THE USER
        user.avatar = result[0];
        // SAVE USER TO DOCUMENT
        yield user.save();
    }
    // SEND RESULT
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "image signed urls fetched", result });
});
