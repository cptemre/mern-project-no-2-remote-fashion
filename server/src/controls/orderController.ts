// EXPRESS
import { RequestHandler } from "express";
// INTERFACES
// MODELS
import {
  CartItemsInterface,
  SingleOrderSchemaInterface,
  OrderStatusInterface,
} from "../utilities/interfaces/models";
// QUERY MODELS
import {
  OrderClientReqInterface,
  SingleOrderQuery,
} from "../utilities/interfaces/controllers";
// CURRENCY
import {
  CurrencyExchangeInterface,
  StripePaymentArgumentsSchema,
} from "../utilities/interfaces/payment";
// MODELS
import { Product, Order, SingleOrder, User } from "../models";
// UTILITIES
import {
  findDocumentByIdAndModel,
  gteAndLteQueryForDb,
  limitAndSkip,
  userIdAndModelUserIdMatchCheck,
  priceAndExchangedPriceCompare,
} from "../utilities/controllers";
// PAYMENT
import { createPayment, transferMoney } from "../utilities/payment/payment";
// ERRORS
import {
  BadRequestError,
  PaymentRequiredError,
  UnauthorizedError,
} from "../errors";
// HTTP STATUS CODES
import { StatusCodes } from "http-status-codes";
import currencyExchangeRates from "../utilities/payment/currencyExchangeRates";
import { Model } from "mongoose";

const createOrder: RequestHandler = async (req, res) => {
  // TODO COUNTRY MUST BE CAPITAL SHORT NAME SUCH AS US. CREATE AN INTERFACE FOR IT
  // CLIENT SIDE REQUESTS
  const {
    currency,
    cardNumber,
    expMonth,
    expYear,
    cvc,
    street,
    city,
    postalCode,
    country,
    state,
  }: StripePaymentArgumentsSchema = req.body;
  // GET CART ITEMS FROM THE USER DOCUMENT
  const user = await findDocumentByIdAndModel({
    id: req.user?._id,
    MyModel: User,
  });
  const cartItems = user.cartItems;
  if (cartItems && cartItems.length < 1)
    throw new BadRequestError(
      "there must be at least one product to order from your cart"
    );
  // THROW AN ERROR IF THERE IS NO CART ITEMS, CURRENCY, PHONE OR ADDRESS INFO
  if (
    !cartItems ||
    !currency ||
    !cardNumber ||
    !expMonth ||
    !expYear ||
    !cvc ||
    !street ||
    !city ||
    !postalCode ||
    !country ||
    !state
  )
    throw new BadRequestError("invalid credientals");
  // ALL ORDERS IN AN ARRAY TO APPEND IT TO ORDER MODEL LATER
  let orderItems: SingleOrderSchemaInterface[] = [];
  // TOTAL PRICE OF SINGLE ORDERS
  let subTotal: number = 0;
  let createdSingleOrders: SingleOrderSchemaInterface[] = [];
  // *LOOP THROUGH CLIENT CART ITEMS OBJECT
  for (let i = 0; i < cartItems.length; i++) {
    // SINGLE CART ITEM BY CLIENT
    const { amount, price, tax, product } = cartItems[i];
    // EXCHANGED PRICE COMPARATION
    const productId = product.toString();
    await priceAndExchangedPriceCompare({
      amount,
      price,
      tax,
      productId,
      currency,
      Product,
    });
    // FIND PRODUCT SELLER
    const productDocument = await findDocumentByIdAndModel({
      id: productId,
      MyModel: Product,
    });
    const seller = productDocument.seller;
    // CREATE A SINGLE ORDER
    const singleOrder = await SingleOrder.create({
      amount,
      price,
      tax,
      currency,
      user: req.user?._id,
      seller,
      product,
    });
    // SEND CREATED SINGLE ORDER TO CREATED SINGLE ORDERS ARRAY FOR CHANGING STATUS LATER
    createdSingleOrders = [...createdSingleOrders, singleOrder];
    // APPEND THIS ORDER TO ORDERITEMS ARRAY
    orderItems = [...orderItems, singleOrder];
    // PRODUCT ORDER PRICE AS GBP
    const productOrderPrice = amount * price;
    // TAX VALUE WITHOUT DOT
    const taxValueWithoutDot = Number((tax / 100).toString().replace(".", ""));
    // APPEND TAX RATE TO EVERY ITEM DEPENDS ON THEIR TAX VALUE
    const productOrderPriceWithTax = productOrderPrice * taxValueWithoutDot;
    // APPEND PRODUCT ORDER PRICE TO SUBTOTAL
    subTotal += productOrderPriceWithTax;
  }
  // *LOOP END

  // SHIPPING FEE AS GBP. IF TOTAL SHOPPING IS ABOVE 75 GBP THEN FREE
  const shippingFee = subTotal >= 7500 ? 0 : 999;
  // APPEND SHIPPING FEE TO FIND TOTAL PRICE
  const totalPrice = subTotal + shippingFee;
  //
  if (!req.user) throw new UnauthorizedError("authorization denied");
  // CREATE THE PAYMENT INTENT
  const paymentIntent = await createPayment({
    totalPrice,
    currency,
    cardNumber,
    expMonth,
    expYear,
    cvc,
    street,
    city,
    postalCode,
    country,
    state,
    user: req.user,
  });
  // CHECK IF PAYMENT INTENT EXISTS
  if (!paymentIntent) throw new PaymentRequiredError("payment required");
  // IF PAYMENT INTENT PROPERTIES DO NOT EXIST THAN THROW AN ERROR
  const { amount, client_secret, id: paymentIntentId } = paymentIntent;
  if (!amount || !client_secret || !paymentIntentId)
    throw new PaymentRequiredError("payment required");
  // CHANGE ALL SINGLE ORDERS STATUS TO PAID AND SAVE THEM TO THE DATABASE
  for (let i = 0; i < createdSingleOrders.length; i++) {
    createdSingleOrders[i].status = "paid";
    await createdSingleOrders[i].save();
  }
  // CLEAR USER CART BECAUSE ORDER IS SUCCESFUL
  user.cartItems = [];
  // CREATE ACTUAL ORDER HERE
  const result = await Order.create({
    orderItems,
    shippingFee,
    subTotal,
    totalPrice,
    currency,
    status: "paid",
    user: req.user?._id,
    clientSecret: client_secret,
    paymentIntentID: paymentIntentId,
  });

  await user.save();
  // SENT CLIENT SECRET TO THE CLIENT
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "order created", result, client_secret });
};

const getAllSingleOrders: RequestHandler = async (req, res) => {
  // GET CLIENT SIDE QUERIES
  const {
    amount,
    priceVal,
    tax,
    currency,
    product: productId,
    seller: sellerId,
    orderPage,
  }: SingleOrderSchemaInterface & {
    orderPage: number;
    priceVal: string;
  } = req.body;
  // EMPTY QUERY
  const query: Partial<SingleOrderQuery> = {};
  // SET QUERY KEYS AND VALUES
  if (amount) query.amount = amount;
  if (priceVal) query.price = gteAndLteQueryForDb(priceVal);
  if (tax) query.tax = tax;
  if (currency) query.currency = currency;
  if (productId) query.product = productId;
  if (sellerId) query.seller = sellerId;
  // IF USER IS A REGULAR USER THEN ADD TO QUERY OF THE USERS ID TO FIND ONLY RELATED SINGLE ORDERS
  if (req.user && req.user.userType === "user") query.user = req.user._id;

  // LIMIT AND SKIP VALUES
  const myLimit = 10;
  const { limit, skip } = limitAndSkip({ limit: myLimit, page: orderPage });
  // FIND DOCUMENTS OF SINGLE ORDERS
  const result = await SingleOrder.find(query).skip(skip).limit(limit);
  // GET THE TOTAL COUNT OF DOCUMENTS
  const length = await SingleOrder.countDocuments(query);
  // RESPONSE
  res
    .status(StatusCodes.OK)
    .json({ msg: "single orders fetched", result, length });
};

const getSingleOrder: RequestHandler = async (req, res) => {
  // GET CLIENT SIDE QUERIES
  const { id: singleOrderId } = req.params;
  // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
  if (!singleOrderId) throw new BadRequestError("single order id is required");
  // FIND THE SINGLE ORDER
  const userId = req.user?.userType === "user" && req.user?._id;
  const sellerId = req.user?.userType === "seller" && req.user?._id;

  const singleOrder = await findDocumentByIdAndModel({
    id: singleOrderId,
    user: userId,
    seller: sellerId,
    MyModel: SingleOrder,
  });
  // CHECK USER MATCHES WITH THE SINGLE ORDER USER
  if (req.user) {
    // SET USER OR SELLER ID TO COMPARE WITH ACTUAL ACCOUNT USER
    let userOrSellerId: string = "";
    if (req.user.userType === "user")
      userOrSellerId = singleOrder.user.toString();
    if (req.user.userType === "seller")
      userOrSellerId = singleOrder.seller.toString();
    userIdAndModelUserIdMatchCheck({
      user: req.user,
      userId: userOrSellerId,
    });
  }
  // RESPONSE
  res
    .status(StatusCodes.OK)
    .json({ msg: "single order fetched", result: singleOrder });
};

const getAllOrders: RequestHandler = async (req, res) => {
  // GET CLIENT SIDE QUERIES
  const {
    isShipping,
    status,
    orderPage,
    priceVal,
    currency,
  }: Omit<OrderClientReqInterface, "price | user"> & { isShipping: 1 } =
    req.body;
  // EMPTY QUERY
  const query: Partial<Omit<OrderClientReqInterface, "priceVal">> = {};
  // SET QUERY KEY AND VALUES
  const sortByShippingFee = isShipping === 1 ? { $gt: 0 } : 0;
  query.shippingFee = sortByShippingFee;
  if (status) query.status = status;
  // IF USER IS NOT ADMIN THEN ADD TO QUERY OF THE USERS ID TO FIND ONLY RELATED SINGLE ORDERS
  if (req.user && req.user.userType !== "admin") query.user = req.user._id;
  if (priceVal) query.price = gteAndLteQueryForDb(priceVal);
  if (currency) query.currency = currency;
  // ! HERE CALCULATE THE PRICE TO GBP
  // LIMIT AND SKIP
  const myLimit = 10;
  const { limit, skip } = limitAndSkip({ limit: myLimit, page: orderPage });

  // FIND DOCUMENTS OF SINGLE ORDERS
  const result = await Order.find(query).skip(skip).limit(limit);
  // GET THE TOTAL COUNT OF DOCUMENTS
  const length = await Order.countDocuments(query);
  // RESPONSE
  res.status(StatusCodes.OK).json({ msg: "orders fetched", result, length });
};

const getOrder: RequestHandler = async (req, res) => {
  // GET CLIENT SIDE QUERY
  const { id: orderId } = req.params;
  // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
  if (!orderId) throw new BadRequestError("order id is required");
  // FIND THE SINGLE ORDER
  const userId = req.user?.userType === "user" && req.user?._id;
  // FIND THE SINGLE ORDER
  const order = await findDocumentByIdAndModel({
    id: orderId,
    user: userId,
    MyModel: Order,
  });
  // CHECK USER MATCHES WITH THE ORDER USER OR IT IS ADMIN
  if (req.user)
    userIdAndModelUserIdMatchCheck({
      user: req.user,
      userId: order.user.toString(),
    });
  // RESPONSE
  res.status(StatusCodes.OK).json({ msg: "order fetched", result: order });
};

const updateOrder: RequestHandler = async (req, res) => {
  // GET ORDER ID FROM THE CLIENT
  const { id: orderId } = req.params;
  // CHECK IF SINGLE ORDER ID IS PROVIDED
  if (!orderId) throw new BadRequestError("order id is required");
  // GET USER ID
  const {
    status,
    singleOrderId,
    destination,
  }: {
    userId: string;
    singleOrderId: string;
    destination: string;
  } & OrderStatusInterface = req.body;

  // CHECK IF BODY VARIABLES ARE PROVIDED

  if (!status || !singleOrderId)
    throw new BadRequestError("status and single order id are required");

  // GET ORDER
  const order = await findDocumentByIdAndModel({
    id: orderId,
    MyModel: Order,
  });
  // CHECK IF CURRENT USER IS NOT ADMIN AND ORDER USER ID IS NOT EQUAL TO USER ID
  if (req.user)
    userIdAndModelUserIdMatchCheck({
      user: req.user,
      userId: order.user.toString(),
    });
  // FIND THIS SINGLE ORDER IN DOCUMENTS
  const singleOrder = await findDocumentByIdAndModel({
    id: singleOrderId,
    MyModel: SingleOrder,
  });
  // IF IT IS A CANCELATION THEN PAY BACK THE MONEY
  if (status === "canceled") {
    if (!destination)
      throw new BadRequestError("destination account no is required");
    const amount = singleOrder.amount;
    const currency = order.currency;
    const transfer = await transferMoney({ amount, currency, destination });
    singleOrder.cancelTransferId = transfer.id;
    // ORDER PAYMENT DECREASE CHANGE DUE TO CANCELATION
    order.subTotal -= singleOrder.amount;
    order.totalPrice -= singleOrder.amount;
    // UPDATE SINGLE ORDER IN ORDER FOR ITS CANCELATION
    order.orderItems.forEach((orderItem) => {
      if (orderItem._id === singleOrder._id) {
        orderItem.cancelTransferId = singleOrder.cancelTransferId;
      }
    });
  }
  // UPDATE THE STATUS OF SINGLE ORDER
  singleOrder.status = status;
  // SAVE THE SINGLE ORDER
  await singleOrder.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "order updated", result: singleOrder });
};

// THERE WONT BE A DELETE CONTROLER FOR ORDERS

const currencyExchange: RequestHandler = async (req, res) => {
  const { from, to, amount }: CurrencyExchangeInterface = req.body;
  const result = await currencyExchangeRates({
    from,
    to,
    amount,
  });

  res.status(StatusCodes.OK).json({ msg: "currency exchange fetched", result });
};

export {
  createOrder,
  getAllOrders,
  getOrder,
  getAllSingleOrders,
  getSingleOrder,
  updateOrder,
  currencyExchange,
};
