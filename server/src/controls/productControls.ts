// MODELS
import { Product, Review, User } from "../models";
// EXPRESS
import { RequestHandler } from "express";
// INTERFACES
import {
  GetAllProductsQueryInterface,
  GetAllProductsReqBodyInterface,
} from "../utilities/interfaces/controllers";
// MODEL INTERFACES
import {
  ProductSchemaInterface,
  UserSchemaInterface,
} from "../utilities/interfaces/models";
// ARRAYS
import { categoriesAndSubCategories } from "../utilities/categories/categoriesAndSubCategories";
// HTTP CODES
import { StatusCodes } from "http-status-codes";
// ERRORS
import { BadRequestError, UnauthorizedError } from "../errors";
// UTILITY FUNCTIONS
import {
  findDocumentByIdAndModel,
  gteAndLteQueryForDb,
  limitAndSkip,
  userIdAndModelUserIdMatchCheck,
} from "../utilities/controllers";

const createProduct: RequestHandler = async (req, res) => {
  // GET CLIENT SIDE BODY REQUEST TO CREATE A PRODUCT
  const {
    name,
    brand,
    price,
    tax,
    image,
    description,
    size,
    gender,
    category,
    subCategory,
    stock,
  }: Omit<ProductSchemaInterface, "numberOfReviews | averateRating | stock"> =
    req.body;
  const stockVal = Number(stock) || 0;
  // CHECK IF ALL NECESSARY CREDENTIALS ARE PROVIDED
  if (
    !name ||
    !brand ||
    !price ||
    !tax ||
    !image ||
    !description ||
    !size ||
    !gender ||
    !category ||
    !subCategory
  )
    throw new BadRequestError("missing credentials");

  // IMAGE ARRAY LENGTH CAN NOT BE MORE THAN 5
  if (image.length > 5)
    throw new BadRequestError("max image files for a product is 5");
  // DESCRIPTION ARRAY LENGTH CAN NOT BE MORE THAN 6
  if (description.length > 6)
    throw new BadRequestError("max description list length for a product is 6");
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

  // USER WHICH CREATED THE PRODUCT TO SELL
  const sellerId = req.user?._id;
  // CREATE A UNIQUE NEW PRODUCT
  const newProduct = await Product.create({
    name,
    brand,
    price,
    tax,
    image,
    description,
    size,
    gender,
    category,
    subCategory,
    stock: stockVal,
    seller: sellerId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "product created", product: newProduct });
};

const getAllProducts: RequestHandler = async (req, res) => {
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
    seller,
  }: Partial<GetAllProductsReqBodyInterface> = req.body;
  // EMPTY QUERY IN SERVER TO SET VALUES
  const query: Partial<GetAllProductsQueryInterface> = {};
  if (name) query.name = name;
  if (brand) query.brand = brand;
  if (color) query.color = color;
  if (size) query.size = size;
  if (price) query.price = gteAndLteQueryForDb(price);
  if (isReview) query.numberOfReviews = { $gt: 0 };
  if (isStock) query.stock = { $gt: 0 };
  if (rating) query.rating = Number(rating);
  if (gender) query.gender = gender;
  console.log(page);

  if (page) query.page = page;
  else query.page = 1;
  if (!req.user) throw new UnauthorizedError("authorization failed");
  const userId = req.user?._id;
  if (seller) query.seller = userId.toString();
  // LIMIT AND SKIP VALUES
  const myLimit = 20;
  const { limit, skip } = limitAndSkip({ limit: myLimit, page: Number(page) });
  // FIND PRODUCTS
  const findProducts = Product.find(query);
  // LIMIT AND SKIP
  const products = await findProducts.skip(skip).limit(limit);
  const productLength = products.length;
  res.status(StatusCodes.OK).json({ products, productLength });
};

const deleteProduct: RequestHandler = async (req, res) => {
  // GET PRODUCT ID FROM BODY
  const { id: productId } = req.params;
  // FIND PRODUCT
  const checkProduct = await findDocumentByIdAndModel({
    id: productId,
    MyModel: Product,
  });
  // GET SELLER ID
  const sellerId = checkProduct.seller.toString();
  // COMPARE USER AND SELLER ID
  if (req.user)
    userIdAndModelUserIdMatchCheck({ user: req.user, userId: sellerId });
  // DELETE THE PRODUCT
  const product = await Product.findOneAndDelete({ _id: productId });
  // ! TEST IF IT WILL BE DELETED FROM CART ITEMS
  // ! TEST IF REVIEWS WILL BE DELETED

  res
    .status(StatusCodes.OK)
    .json({ msg: "product, related reviews and cart items are deleted" });
};

const getSingleProduct: RequestHandler = async (req, res) => {
  // GET PRODUCT ID FROM BODY
  const { id: productId } = req.params;
  // FIND THE PRODUCT
  const product = await findDocumentByIdAndModel({
    id: productId,
    MyModel: Product,
  });

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct: RequestHandler = async (req, res) => {
  // GET PRODUCT ID FROM BODY
  const { id: productId } = req.params;
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
    stock,
  }: Omit<ProductSchemaInterface, "numberOfReviews | averageRating"> = req.body;
  // FIND THE PRODUCT
  const product = await findDocumentByIdAndModel({
    id: productId,
    MyModel: Product,
  });
  // UPDATE PROPERTIES
  if (name) product.name = name;
  if (brand) product.brand = brand;
  if (price) product.price = Number(price);
  if (image) product.image = image;
  if (description) product.description = description;
  if (size) product.size = size;
  if (gender) product.gender = gender;
  if (category) product.category = category;
  if (subCategory) product.subCategory = subCategory;
  if (stock) product.stock = stock;
  // SAVE UPDATED PRODUCT
  await product.save();

  res.status(StatusCodes.OK).json({ msg: "product updated", product });
};

export {
  createProduct,
  getAllProducts,
  deleteProduct,
  getSingleProduct,
  updateProduct,
};
