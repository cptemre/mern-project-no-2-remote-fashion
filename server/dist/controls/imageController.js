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
    const { type, product: productId, } = req.body;
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
    if ((type === categories_1.imageUploadTypes[0] && productImagesFiles.length < 2) ||
        !productId)
        throw new errors_1.BadRequestError("minimum product image length is 2");
    // AVATAR CAN BE ONLY ONE IMAGE IN THE ARRAY TO UPLOAD
    if (type === categories_1.imageUploadTypes[1] && productImagesFiles.length === 1)
        throw new errors_1.BadRequestError("you can not upload more than one avatar image");
    // USER MUST BE LOGGED IN
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
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
        // UPDATE PRODUCT IMAGE OR USER AVATAR DEPENDS ON THE CLIENT TYPE PROPERTY
        if (type === categories_1.imageUploadTypes[0]) {
            // GET PRODUCT
            const product = yield (0, controllers_1.findDocumentByIdAndModel)({
                id: productId,
                MyModel: models_1.Product,
            });
            // CHECK IF SELLER AND PRODUCT SELLER MATCH
            const { userType, _id: reqUserId } = req.user;
            const sellerId = product.seller;
            (0, controllers_1.userIdAndModelUserIdMatchCheck)({
                userType,
                userId: sellerId,
                reqUserId,
            });
            // UPDATE PRODUCT IMAGES
            product.images = [...product.images];
        }
    }
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "images are uploaded" });
});
exports.uploadImages = uploadImages;
const getProductImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
