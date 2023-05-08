import { Schema, model } from "mongoose";
import { ImageSchemaInterface } from "../utilities/interfaces/models";
import { imageUploadTypes } from "../utilities/categories";

const ImageSchema = new Schema<ImageSchemaInterface>({
  originalName: {
    type: String,
    required: [true, "original image name is required"],
    minlength: [1, "original image name must be at least 1 character"],
    maxlength: [200, "original image name can not be more than 200 characters"],
  },
  cryptoName: {
    type: String,
    required: [true, "crypto image name is required"],
  },
  mimeType: {
    type: String,
    required: [true, "image type is required"],
    maxlength: [10, "image type can not be more than 10 characters"],
  },
  size: {
    type: Number,
    required: [true, "image size is required"],
    min: [80000, "image size must be at least 80kb"],
    max: [500000, "image size can not be more than 500kb"],
  },
  url: String,
  type: {
    type: String,
    enum: {
      values: imageUploadTypes,
      message: `image type must be one of the following: ${imageUploadTypes}`,
    },
  },
});

const Image = model("Image", ImageSchema);

export default Image;
