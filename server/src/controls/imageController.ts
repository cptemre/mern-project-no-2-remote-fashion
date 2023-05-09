import { RequestHandler } from "express";
import { createCrypto } from "../utilities/token";
import { Image, Product, User } from "../models";
import {
  ImageSchemaInterface,
  ProductSchemaInterface,
  UserSchemaInterface,
} from "../utilities/interfaces/models";
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
  const { type }: { type: ImageSchemaInterface["type"] } = req.body;
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
  if (type === imageUploadTypes[0] && productImagesFiles.length < 2)
    throw new BadRequestError("minimum product image length is one");
  // AVATAR CAN BE ONLY ONE IMAGE IN THE ARRAY TO UPLOAD
  if (type === imageUploadTypes[1] && productImagesFiles.length === 1)
    throw new BadRequestError("you can not upload more than one avatar image");
  // USER MUST BE LOGGED IN
  if (!req.user) throw new UnauthorizedError("authorization denied");
  // ALL IMAGES AS DOCUMENTS
  let result: ImageSchemaInterface[] = [];
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
    // PUSH CREATED IMAGE DOCUMENT TO RESULT ARRAY
    result = [...result, image];
  }
  res.status(StatusCodes.CREATED).json({ msg: "images are uploaded", result });
};

const getSignedUrls: RequestHandler = async (req, res) => {
  // GET IMAGE AND PRODUCT ID FROM CLIENT
  const {
    images,
    type,
    product: productId,
  }: {
    images: string[];
    type: ImageSchemaInterface["type"];
    product: string;
  } = req.body;
  // CHECK CREDENTIALS
  if (!images || !type) throw new BadRequestError("invalid credentials");
  // USER MUST BE LOGGED IN
  if (!req.user) throw new UnauthorizedError("authorization denied");
  // USER TYPE AND ID
  const { userType, _id: reqUserId } = req.user;
  // CHECK TYPE PRODUCT
  let product: ProductSchemaInterface | undefined;
  if (type === imageUploadTypes[0]) {
    // GET PRODUCT DOCUMENT
    product = await findDocumentByIdAndModel({
      id: productId,
      MyModel: Product,
    });
    // CHECK IF SELLER AND PRODUCT SELLER MATCH
    userIdAndModelUserIdMatchCheck({ userType, userId: productId, reqUserId });
  }

  // CHECK TYPE PRODUCT
  let user: UserSchemaInterface | undefined;
  if (type === imageUploadTypes[1])
    // GET PRODUCT DOCUMENT
    user = await findDocumentByIdAndModel({
      id: reqUserId,
      MyModel: User,
    });

  // RESULT ARRAY
  let result: string[] = [];
  // LOOP THROUGH IMAGE CRYPTO NAMES TO GET SIGNED URL FROM AWS S3
  for (let i = 0; i < images.length; i++) {
    // GET IMAGE DOCUMENT
    const image = await findDocumentByIdAndModel({
      id: images[i],
      MyModel: Image,
    });
    // COMPARE IMAGE DOCUMENT TYPE AND PROVIDED TYPE TO COMPARE IF IT BELONGS TO PRODUCT OR AVATAR
    if (image.type !== type)
      throw new BadRequestError("image type does not match");
    // GET COMMAND WITH BUCKET NAME AND CRYPO NAME
    const command = new GetObjectCommand({
      Bucket: bucket_name,
      Key: image.cryptoName,
    });
    // GET URL
    const signedUrl = await getSignedUrl(s3, command);
    // PUSH URL TO RESULT ARRAY
    result = [...result, signedUrl];
  }
  // IF PRODUCT DOCUMENT EXISTS
  if (product) {
    // WRITE THE SIGNED URL IN THE PRODUCT
    product.images = result;
    // SAVE PRODUCT TO DOCUMENT
    await product.save();
  }
  // IF USER DOCUMENT EXISTS
  if (user) {
    // WRITE THE SIGNED URL IN THE USER
    user.avatar = result[0];
    // SAVE USER TO DOCUMENT
    await user.save();
  }

  // SEND RESULT
  res.status(StatusCodes.OK).json({ msg: "image signed urls fetched", result });
};

export { uploadImages };
