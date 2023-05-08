import { RequestHandler } from "express";
import { createCrypto } from "../utilities/token";
// AWS S3 CLIENT
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// ERROR
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
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
const uploadProductImages: RequestHandler = async (req, res) => {
  // REQ FILES
  const productImagesFiles = req.files;
  // CHECK IF THERE ARE FILES
  if (!productImagesFiles)
    throw new BadRequestError("there is no product image");
  // CHECK IF IT IS AN ARRAY
  if (!Array.isArray(productImagesFiles))
    throw new BadRequestError("there is no image");
  // * MAX IMAGE LIMIT ERROR IS IN ERROR HANDLER FILE IN MIDDLEWARES FOLDER
  // UPLOAD AT LEAST 2 IMAGES
  if (productImagesFiles.length < 2)
    throw new BadRequestError("minimum product image length is 2");
  // LOOP THROUGH ALL FILES
  for (let i = 0; i < productImagesFiles.length; i++) {
    // FILE PROPERTIES
    const originalName = productImagesFiles[i].originalname;
    const mimetype = productImagesFiles[i].mimetype;
    const buffer = productImagesFiles[i].buffer;
    const size = productImagesFiles[i].size;
    // FILE CAN NOT BE MORE THAN 500KB
    if (size > 500000) throw new BadRequestError("maximum image size is 500kb");
    // FILE CAN ONLY BE IN JPEG FORMAT
    if (mimetype !== "image/jpeg")
      throw new BadRequestError("image type must be jpeg");

    // COMMAND FOR S3
    const command = new PutObjectCommand({
      Bucket: bucket_name,
      Key: createCrypto(),
      Body: buffer,
      ContentType: mimetype,
    });
    // UPLOAD IMAGES
    await s3.send(command);
  }
  res.status(StatusCodes.CREATED).json({ msg: "images are uploaded" });
};

export { uploadProductImages };
