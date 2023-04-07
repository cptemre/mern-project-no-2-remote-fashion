// MODELS
import { Product } from "../models";
// EXPRESS
import { Request, Response } from "express";
// INTERFACES
import {
  GetAllProductsQueryInterface,
  GetAllProductsReqBodyInterface,
  ProductSchemaInterface,
} from "../utilities/interfaces";
// ARRAYS
import { categoriesAndSubCategories } from "../utilities/categories/categoriesAndSubCategories";
// HTTP CODES
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "../errors";

const createProduct = async (req: Request, res: Response) => {
  // GET CLIENT SIDE BODY REQUEST TO CREATE A PRODUCT
  const {
    name,
    brand,
    price,
    image,
    description,
    size,
    gender,
    category,
    subCategory,
  }: Omit<ProductSchemaInterface, "numberOfReviews | averateRating | stock"> =
    req.body;
  const stock = Number(req.body.stock) || 0;
  // CHECK IF ALL NECESSARY CREDENTIALS ARE PROVIDED
  if (
    !name ||
    !brand ||
    !price ||
    !image ||
    !description ||
    !size ||
    !gender ||
    !category ||
    !subCategory
  )
    throw new BadRequestError("missing credentials");

  // IMAGE ARRAY LENGTH CAN NOT BE MORE THAN 4
  if (image.length > 4)
    throw new BadRequestError("max image files for a product is 5");
  // DESCRIPTION ARRAY LENGTH CAN NOT BE MORE THAN 4
  if (description.length > 4)
    throw new BadRequestError("max description list length for a product is 5");
  // ONE DESCRIPTION LENGTH ERROR
  for (let i = 0; i < description.length; i++) {
    if (description[i].length > 24)
      throw new BadRequestError(
        "a description can not be longer than 24 characters"
      );
  }
  // CHECK IF CATEGORY MATCHES WITH THE SUB-CATEGORY
  if (!categoriesAndSubCategories[category].includes(subCategory))
    throw new BadRequestError("sub-category does not match with the category");

  // CHECK IF THE PRODUCT WITH THE SAME NAME AND BRAND EXISTS
  const product = await Product.findOne({ name, brand });
  if (product) throw new UnauthorizedError("product already exists");

  // CREATE A UNIQUE NEW PRODUCT
  const newProduct = await Product.create({
    name,
    brand,
    price,
    image,
    description,
    size,
    gender,
    category,
    subCategory,
    stock,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "product created", product: newProduct });
};

const getAllProducts = async (req: Request, res: Response) => {
  // QUERY FROM THE CLIENT
  const {
    name,
    brand,
    color,
    size,
    price,
    isReview,
    isStock,
    rating,
    gender,
    page,
  }: Partial<GetAllProductsReqBodyInterface> = req.body;
  // EMPTY QUERY IN SERVER TO SET VALUES
  const query: Partial<GetAllProductsQueryInterface> = {};
  if (name) query.name = name;
  if (brand) query.brand = brand;
  if (color) query.color = color;
  if (size) query.size = size;

  if (price) {
    // EXAMPLE: gte-50_lte-100
    const [gteString, lteString] = price.split("_");
    let gteVal: number;
    const priceVal: { $gte: number | undefined; $lte: number | undefined } = {
      $gte: undefined,
      $lte: undefined,
    };
    if (gteString && gteString.startsWith("gte-")) {
      // EXAMPLE: [gte,50]
      const gte: string[] = gteString.split("-");
      // EXAMPLE: 50
      let gteVal: number = Number(gte[1]);
      // {$gte: 50}
      priceVal.$gte = gteVal;
    }
    if (lteString && lteString.startsWith("lte-")) {
      // EXAMPLE: [lte,100]
      const lte: string[] = lteString.split("-");
      // EXAMPLE: 100
      let lteVal: number = Number(lte[1]);
      // {$lte: 100}
      priceVal.$lte = lteVal;
    }
  }
  // ! CHECK HERE AFTER REVIEW MODEL CREATED
  // if (isReview) query.isReview = isReview === "true";
  if (isStock === "true") query.stock = { $gt: 0 };
  if (rating) query.rating = Number(rating);
  if (gender) query.gender = gender;
  if (page) query.page = Number(page);
  else query.page = 1;

  const limit = 10;
  const skip = limit * (Number(page) - 1);
  const findProducts = Product.find(query);

  const products = await findProducts.skip(skip).limit(limit);

  res.status(StatusCodes.OK).json({ products });
};
