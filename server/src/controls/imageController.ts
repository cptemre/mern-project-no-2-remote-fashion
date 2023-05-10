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
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// ERROR
import { BadRequestError, UnauthorizedError } from "../errors";
import { StatusCodes } from "http-status-codes";
import {
  findDocumentByIdAndModel,
  userIdAndModelUserIdMatchCheck,
} from "../utilities/controllers";
import { ObjectId } from "mongoose";
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
  const { type } = req.params;
  // CHECK IF TYPE IS CORRECT
  if (!imageUploadTypes.includes(type))
    throw new BadRequestError("invalid type");
  const productImagesFiles = req.files;
  // CHECK IF THERE ARE FILES
  if (!productImagesFiles)
    throw new BadRequestError("there is no product image");
  // CHECK IF IT IS AN ARRAY
  if (!Array.isArray(productImagesFiles))
    throw new BadRequestError("there is no image");
  // * MAX IMAGE LIMIT ERROR IS IN ERROR HANDLER FILE IN MIDDLEWARES FOLDER
  // AVATAR CAN BE ONLY ONE IMAGE IN THE ARRAY TO UPLOAD
  if (type === imageUploadTypes[1] && productImagesFiles.length !== 1)
    throw new BadRequestError("you can not upload more than one avatar image");
  // USER MUST BE LOGGED IN
  if (!req.user) throw new UnauthorizedError("authorization denied");
  // USER ID
  const { _id: userId } = req.user;
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
      createdBy: userId,
    });
    // PUSH CREATED IMAGE DOCUMENT TO RESULT ARRAY
    result = [...result, image];
  }
  res.status(StatusCodes.CREATED).json({ msg: "images are uploaded", result });
};

const getSignedUrls: RequestHandler = async (req, res) => {
  // GET IMAGE AND PRODUCT ID FROM CLIENT
  const { id } = req.params;
  const {
    images,
    type,
  }: {
    images: string[];
    type: ImageSchemaInterface["type"];
  } = req.body;
  // CHECK IF TYPE IS CORRECT
  if (!imageUploadTypes.includes(type))
    throw new BadRequestError("invalid type");
  // SET ID FROM PARAM BY TYPE
  let productId: string = "";
  let userId: string = "";
  // TYPE === 'product'
  if (type === imageUploadTypes[0]) productId = id;
  // TYPE === 'avatar'
  if (type === imageUploadTypes[1]) userId = id;
  // CHECK IF ANY ID IS PROVIDED
  if (!productId && !userId)
    throw new BadRequestError("document id is missing");
  // CHECK CREDENTIALS
  if (!images) throw new BadRequestError("image id required");
  // USER MUST BE LOGGED IN
  if (!req.user) throw new UnauthorizedError("authorization denied");
  // USER TYPE AND ID
  const { userType, _id: reqUserId } = req.user;
  // EMPTY PRODUCT VARIABLE
  let product: ProductSchemaInterface | undefined;
  //* IF IT IS PRODUCT TYPE
  if (productId) {
    // GET PRODUCT DOCUMENT
    product = await findDocumentByIdAndModel({
      id: productId,
      MyModel: Product,
    });
    // CHECK IF SELLER AND PRODUCT SELLER MATCH
    userIdAndModelUserIdMatchCheck({
      userType,
      userId: product.seller,
      reqUserId,
    });
  }
  //* IF IT IS USER TYPE
  let user: UserSchemaInterface | undefined;
  if (type === imageUploadTypes[1])
    // GET PRODUCT DOCUMENT - NO NEED TO COMPARE BECAUSE ID GETS FROM REQ.USER
    user = await findDocumentByIdAndModel({
      id: reqUserId,
      MyModel: User,
    });
  // IMAGES ARRAY TO SET WITH IMAGES
  let imagesArray: ImageSchemaInterface[] = [];
  //* LOOP THROUGH IMAGE CRYPTO NAMES TO GET SIGNED URL FROM AWS S3
  for (let i = 0; i < images.length; i++) {
    // GET IMAGE DOCUMENT
    const image = await findDocumentByIdAndModel({
      id: images[i],
      MyModel: Image,
    });
    // CHECK IF THE IMAGE IS CREATED BY THE CURRENT USER
    if (image.createdBy !== reqUserId && userType !== "admin")
      throw new UnauthorizedError("image creater id does not match");
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
    // SET URL TO IMAGE DOCUMENT
    image.url = signedUrl;
    // PUSH IMAGE DOCUMENT TO RESULT ARRAY
    imagesArray = [...imagesArray, image];
    // IF PRODUCT DOCUMENT EXISTS SET IMAGE PRODUCT
    if (product) image.product = product._id;
    // IF USER DOCUMENT EXISTS SET IMAGE USER
    if (user) image.user = user._id;
    // SAVE IMAGE DOCUMENT
    await image.save();
  }
  //* LOOP END
  // SET IMAGES DOCUMENT ARRAY LENGTH
  const imagesArrayLength = imagesArray.length;
  // SEND RESULT
  res.status(StatusCodes.OK).json({
    msg: "image signed urls updated",
    result: imagesArray,
    length: imagesArrayLength,
  });
};

const deleteImage: RequestHandler = async (req, res) => {
  const { id: imageId } = req.params;
  // CHECK IF TYPE IS CORRECT
  if (!req.user) throw new UnauthorizedError("authorization denied");
  // REQ USER ID
  const { userType, _id: reqUserId } = req.user;
  // FIND IMAGE DOCUMENT
  const image = await findDocumentByIdAndModel({
    id: imageId,
    MyModel: Image,
  });
  // IMAGE CRYPTED NAME
  const { cryptoName, type, product: productId, user: userId } = image;

  // CREATE DELETE COMMAND
  const command = new DeleteObjectCommand({
    Bucket: bucket_name,
    Key: cryptoName,
  });
  await s3.send(command);

  //* TYPE === PRODUCT
  if (type === imageUploadTypes[0]) {
    if (!productId) throw new UnauthorizedError("authorization denied");
    // FIND PRODUCT DOCUMENT
    const product = await findDocumentByIdAndModel({
      id: productId,
      MyModel: Product,
    });
    if (product.images.length < 3)
      throw new BadRequestError(
        "there has to be at least 2 images for the product"
      );
    // COMPARE IMAGE USER AND ACTUAL USER FOR AUTHORIZATION
    userIdAndModelUserIdMatchCheck({
      userType,
      userId: product.seller,
      reqUserId,
    });
    // FILTER THE REQUIRED IMAGE ID FROM PRODUCT IMAGES ARRAY
    const filteredImages = product.images.filter(
      (image) => image.toString() !== imageId
    );
    // SET NEW ARRAY TO THE PRODUCT
    product.images = filteredImages;
    // SAVE PRODUCT
    await product.save();
  }
  //* TYPE === AVATAR
  if (type === imageUploadTypes[1]) {
    if (!userId) throw new UnauthorizedError("authorization denied");
    // COMPARE IMAGE USER AND ACTUAL USER FOR AUTHORIZATION
    userIdAndModelUserIdMatchCheck({ userType, userId, reqUserId });
    // FIND USER DOCUMENT
    const user = await findDocumentByIdAndModel({
      id: userId,
      MyModel: User,
    });
    // SET ITS AVATAR TO EMPTY STRING
    user.avatar = "";
    // SAVE THE USER
    await user.save();
  }
  // DELETE IMAGE DOCUMENT
  await Image.findOneAndDelete({ _id: imageId });
  res.status(StatusCodes.OK).json({ msg: "image deleted" });
};

export { uploadImages, getSignedUrls, deleteImage };
