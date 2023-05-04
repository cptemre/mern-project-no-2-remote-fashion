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
  CurrencyUpperCaseInterface,
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
  if (!req.user) throw new UnauthorizedError("authorization failed");
  const userId = req.user._id;
  const user = await findDocumentByIdAndModel({
    id: userId.toString(),
    MyModel: User,
  });
  //
  const to = currency.toUpperCase() as CurrencyExchangeInterface["to"];

  // TODO CLIENT MUST CHECK CART ITEM PRODUCT PRICE AND REST OF THE PARAMATERS FOR ANY CHANGE BEFORE SENDING A CREATE ORDER REQUEST
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
    // THIS VARIABLE WILL BE EQUAL TO PRICE FROM CART.
    // IF CURRENCY IS NOT GBP THEN PRICE WILL BE RECALCULATED AND WILL BE SET TO THIS VARIABLE
    let priceVal: number = price;

    if (currency !== "gbp") {
      const exchangedPriceVal = await currencyExchangeRates({
        from: "GBP",
        to,
        amount: price,
      });
      if (!exchangedPriceVal)
        throw new BadRequestError("price exchange failed");
      priceVal = exchangedPriceVal;
    }

    // EXCHANGED PRICE COMPARATION
    const productId = product.toString();
    await priceAndExchangedPriceCompare({
      amount,
      price: priceVal,
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
      price: priceVal,
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
    const productOrderPrice = amount * priceVal;
    // TAX VALUE WITHOUT DOT
    const taxValueWithoutDot = Number((tax / 100).toFixed(2)) * 100;
    // APPEND TAX RATE TO EVERY ITEM DEPENDS ON THEIR TAX VALUE
    const productOrderPriceWithTax = productOrderPrice + taxValueWithoutDot;
    // APPEND PRODUCT ORDER PRICE TO SUBTOTAL
    subTotal += productOrderPriceWithTax;
  }
  // *LOOP END

  // SHIPPING FEE AS GBP. IF TOTAL SHOPPING IS ABOVE 75 GBP THEN FREE
  // THIS WILL BE RECALCULATED IF CURRENCY IS NOT GBP
  let shippingFee = subTotal >= 7500 ? 0 : 999;
  if (currency !== "gbp") {
    const exchangedPriceVal = await currencyExchangeRates({
      from: "GBP",
      to,
      amount: shippingFee,
    });
    if (!exchangedPriceVal) throw new BadRequestError("price exchange failed");
    shippingFee = exchangedPriceVal;
  }
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

  // CLEAR USER CART BECAUSE ORDER IS SUCCESFUL
  user.cartItems = [];
  // CREATE ACTUAL ORDER HERE
  const order = await Order.create({
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
  // CHANGE ALL SINGLE ORDERS STATUS TO PAID AND SAVE THEM TO THE DATABASE
  for (let i = 0; i < createdSingleOrders.length; i++) {
    createdSingleOrders[i].status = "paid";
    createdSingleOrders[i].order = order._id;
    await createdSingleOrders[i].save();
  }
  await user.save();
  // SENT CLIENT SECRET TO THE CLIENT
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "order created", result: order, client_secret });
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
    order: orderId,
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
  if (orderId) query.order = orderId;
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
    user: userId.toString(),
    seller: sellerId.toString(),
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
    user: userId.toString(),
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
  const { id: singleOrderId } = req.params;
  // CHECK IF SINGLE ORDER ID IS PROVIDED
  if (!singleOrderId) throw new BadRequestError("single order id is required");
  // GET USER ID
  const {
    status,
    destination,
  }: {
    userId: string;
    destination: string;
  } & OrderStatusInterface = req.body;

  // CHECK IF BODY VARIABLES ARE PROVIDED

  if (!status || !singleOrderId)
    throw new BadRequestError("status and single order id are required");

  // FIND THIS SINGLE ORDER IN DOCUMENTS
  const singleOrder = await findDocumentByIdAndModel({
    id: singleOrderId,
    MyModel: SingleOrder,
  });
  // CHECK IF CURRENT USER IS NOT ADMIN AND ORDER USER ID IS NOT EQUAL TO USER ID
  if (req.user) {
    let userOrSellerId =
      req.user.userType === "user" ? singleOrder.user : singleOrder.seller;
    userIdAndModelUserIdMatchCheck({
      user: req.user,
      userId: userOrSellerId.toString(),
    });
  }

  // IF IT IS A CANCELATION THEN PAY BACK THE MONEY
  // TODO IF USER THEN CHECK DELIVED STATUS AND DELIVERY DATE. IF IT IS DELIVERED NOT MORE THAN 2 WEEKS AGO THEN ACCEPT CANCELATION
  // TODO IF SELLER THEN CHECK IF IT IS PAID
  // TODO IF COURIER THEN CHECK IF IT IS PAID
  if (status === "canceled") {
    if (!destination)
      throw new BadRequestError("destination account no is required");
    const amount = singleOrder.amount;
    const currency = singleOrder.currency;
    const transfer = await transferMoney({ amount, currency, destination });
    singleOrder.cancelTransferId = transfer.id;
    // FIND ORDER
    const order = await findDocumentByIdAndModel({
      id: singleOrder.order.toString(),
      MyModel: Order,
    });
    // ORDER PAYMENT DECREASE CHANGE DUE TO CANCELATION
    order.subTotal -= singleOrder.amount;
    order.totalPrice -= singleOrder.amount;
    // UPDATE SINGLE ORDER IN ORDER FOR ITS CANCELATION
    order.orderItems.forEach((orderItem) => {
      if (orderItem._id === singleOrder._id) {
        orderItem.cancelTransferId = singleOrder.cancelTransferId;
      }
    });
    const everySingleOrderCanceled = order.orderItems.every(
      (orderItem) => orderItem.cancelTransferId
    );
    if (everySingleOrderCanceled) order.status = "canceled";
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
