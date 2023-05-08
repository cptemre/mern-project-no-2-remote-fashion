import { RequestHandler } from "express";
import { createCrypto } from "../utilities/token";
import { Image, Product } from "../models";
import { ImageSchemaInterface } from "../utilities/interfaces/models";
import { imageUploadTypes } from "../utilities/categories";
// AWS S3 CLIENT
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// ERROR
import { BadRequestError, UnauthorizedError } from "../errors";
import { StatusCodes } from "http-status-codes";
import {
  findDocumentByIdAndModel,
  userIdAndModelUserIdMatchCheck,
} from "../utilities/controllers";
// BUCKET ENV VARIABLES
const bucket_name = process.env.BUCKET_NAME as string;
const bucket_region = process.env.BUCKET_REGION as string;
const bucket_access_key = process.env.BUCKET_ACCESS_KEY as string;
const bucket_secret_access_key = process.env.BUCKET_SECRET_ACCESS_KEY as string;
// CONNECT TO S3 BUCKET
const s3 = new S3Client({
  credentials: {
    accessKeyId: bucket_access_key,
    secretAccessKey: bucket_secret_access_key,
  },
  region: bucket_region,
});
const uploadImages: RequestHandler = async (req, res) => {
  // LEARN IF PRODUCT OR AVATAR IMAGE TYPE
  const {
    type,
    product: productId,
  }: { type: ImageSchemaInterface["type"]; product: string } = req.body;
  // THROW AN ERROR IF THERE IS NO TYPE FROM THE CLIENT
  if (!type) throw new BadRequestError("image type is required");
  // REQ FILES
  const productImagesFiles = req.files;
  // CHECK IF THERE ARE FILES
  if (!productImagesFiles)
    throw new BadRequestError("there is no product image");
  // CHECK IF IT IS AN ARRAY
  if (!Array.isArray(productImagesFiles))
    throw new BadRequestError("there is no image");
  // * MAX IMAGE LIMIT ERROR IS IN ERROR HANDLER FILE IN MIDDLEWARES FOLDER
  // THROW ERROR IF THE TYPE IS PRODUCT AND IMAGES ARE LESS THAN 2 OR THERE IS NO PRODUCT ID
  if (
    (type === imageUploadTypes[0] && productImagesFiles.length < 2) ||
    !productId
  )
    throw new BadRequestError("minimum product image length is 2");
  // AVATAR CAN BE ONLY ONE IMAGE IN THE ARRAY TO UPLOAD
  if (type === imageUploadTypes[1] && productImagesFiles.length === 1)
    throw new BadRequestError("you can not upload more than one avatar image");
  // USER MUST BE LOGGED IN
  if (!req.user) throw new UnauthorizedError("authorization denied");
  // LOOP THROUGH ALL FILES
  for (let i = 0; i < productImagesFiles.length; i++) {
    // FILE PROPERTIES
    const originalName = productImagesFiles[i].originalname;
    const mimeType = productImagesFiles[i].mimetype;
    const buffer = productImagesFiles[i].buffer;
    const size = productImagesFiles[i].size;
    const cryptoName = createCrypto();
    // FILE CAN NOT BE MORE THAN 500KB
    if (size > 500000) throw new BadRequestError("maximum image size is 500kb");
    // FILE CAN ONLY BE IN JPEG FORMAT
    if (mimeType !== "image/jpeg")
      throw new BadRequestError("image type must be jpeg");

    // COMMAND FOR S3
    const command = new PutObjectCommand({
      Bucket: bucket_name,
      Key: cryptoName,
      Body: buffer,
      ContentType: mimeType,
    });
    // UPLOAD IMAGE
    await s3.send(command);
    // CREATE AN IMAGE DOCUMENT
    const image = await Image.create({
      originalName,
      cryptoName,
      mimeType,
      size,
      type,
    });
    // UPDATE PRODUCT IMAGE OR USER AVATAR DEPENDS ON THE CLIENT TYPE PROPERTY
    if (type === imageUploadTypes[0]) {
      // GET PRODUCT
      const product = await findDocumentByIdAndModel({
        id: productId,
        MyModel: Product,
      });
      // CHECK IF SELLER AND PRODUCT SELLER MATCH
      const { userType, _id: reqUserId } = req.user;
      const sellerId = product.seller;
      userIdAndModelUserIdMatchCheck({
        userType,
        userId: sellerId,
        reqUserId,
      });
      // UPDATE PRODUCT IMAGES
      product.images = [...product.images];
    }
  }
  res.status(StatusCodes.CREATED).json({ msg: "images are uploaded" });
};

const getProductImages: RequestHandler = async (req, res) => {};

export { uploadImages };
