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
exports.uploadProductImages = void 0;
const token_1 = require("../utilities/token");
// AWS S3 CLIENT
const client_s3_1 = require("@aws-sdk/client-s3");
// ERROR
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
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
const uploadProductImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // REQ FILES
    const productImagesFiles = req.files;
    // CHECK IF THERE ARE FILES
    if (!productImagesFiles)
        throw new errors_1.BadRequestError("there is no product image");
    // CHECK IF IT IS AN ARRAY
    if (!Array.isArray(productImagesFiles))
        throw new errors_1.BadRequestError("there is no image");
    // * MAX IMAGE LIMIT ERROR IS IN ERROR HANDLER FILE IN MIDDLEWARES FOLDER
    // UPLOAD AT LEAST 2 IMAGES
    if (productImagesFiles.length < 2)
        throw new errors_1.BadRequestError("minimum product image length is 2");
    // LOOP THROUGH ALL FILES
    for (let i = 0; i < productImagesFiles.length; i++) {
        // FILE PROPERTIES
        const originalName = productImagesFiles[i].originalname;
        const mimetype = productImagesFiles[i].mimetype;
        const buffer = productImagesFiles[i].buffer;
        const size = productImagesFiles[i].size;
        // FILE CAN NOT BE MORE THAN 500KB
        if (size > 500000)
            throw new errors_1.BadRequestError("maximum image size is 500kb");
        // FILE CAN ONLY BE IN JPEG FORMAT
        if (mimetype !== "image/jpeg")
            throw new errors_1.BadRequestError("image type must be jpeg");
        // COMMAND FOR S3
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucket_name,
            Key: (0, token_1.createCrypto)(),
            Body: buffer,
            ContentType: mimetype,
        });
        // UPLOAD IMAGES
        yield s3.send(command);
    }
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "images are uploaded" });
});
exports.uploadProductImages = uploadProductImages;
