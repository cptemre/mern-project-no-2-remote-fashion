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

const createOrder: RequestHandler = async (req, res) => {
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
  // *LOOP THROUGH CLIENT CART ITEMS OBJECT
  for (let i = 0; i < cartItems.length; i++) {
    // SINGLE CART ITEM BY CLIENT
    const { amount, price, tax, product: productId } = cartItems[i];
    //
    let exchangedPrice = price;
    // FIND THE DOCUMENT OF PRODUCT
    const product = await findDocumentByIdAndModel({
      id: productId as string,
      MyModel: Product,
    });
    // IF CURRENCY IS ANOTHER THAN gbp GET EXCHANGE VALUE
    if (currency.toUpperCase() !== "GBP") {
      // CURRENCY CHANGE TO GBP
      const exchangedValue = await currencyExchangeRates({
        from: "GBP",
        to: currency.toUpperCase() as CurrencyExchangeInterface["to"],
        amount: product.price,
      });
      // IF THERE IS A NUMBER VALUE THEN SET IT EQUAL TO SUBTOTAL
      // FROM NOW ON IN THIS CONTROLLER VALUES ARE IN GBP CURRENCY
      if (exchangedValue) exchangedPrice = exchangedValue;
    }
    if (price !== exchangedPrice)
      throw new BadRequestError("requested price is not correct");
    // CREATE A SINGLE ORDER
    const singleOrder = await SingleOrder.create({
      amount,
      price: exchangedPrice,
      currency,
      user: req.user?._id,
      product,
    });
    // APPEND THIS ORDER TO ORDERITEMS ARRAY
    orderItems = [...orderItems, singleOrder];
    // PRODUCT ORDER PRICE AS GBP
    const productOrderPrice = amount * exchangedPrice;
    // TAX VALUE WITHOUT DOT
    const taxValueWithoutDot = Number(
      (tax / 10000).toString().replace(".", "")
    );
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
  if (!amount || client_secret || paymentIntentId)
    throw new PaymentRequiredError("payment required");
  // CREATE ACTUAL ORDER HERE
  const result = await Order.create({
    orderItems,
    shippingFee,
    subTotal,
    totalPrice,
    currency,
    user: req.user?._id,
    clientSecret: client_secret,
    paymentIntentID: paymentIntentId,
  });
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
    product: productId,
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
  if (productId) query.product = productId;
  // IF USER IS NOT ADMIN THEN ADD TO QUERY OF THE USERS ID TO FIND ONLY RELATED SINGLE ORDERS
  if (req.user && req.user.userType !== "admin") query.user = req.user._id;
  // FIND DOCUMENTS OF SINGLE ORDERS
  const singleOrder = SingleOrder.find(query);
  // COUNT THE DOCUMENTS
  const singleOrderLength = singleOrder.countDocuments();
  // LIMIT AND SKIP VALUES
  const myLimit = 10;
  const { limit, skip } = limitAndSkip({ limit: myLimit, page: orderPage });

  const result = await singleOrder.skip(skip).limit(limit);
  // RESPONSE
  res
    .status(StatusCodes.OK)
    .json({ msg: "single orders fetched", result, lenght: singleOrderLength });
};

const getSingleOrder: RequestHandler = async (req, res) => {
  // GET CLIENT SIDE QUERIES
  const { product: productId } = req.params;
  // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
  if (!productId) throw new BadRequestError("product id is required");
  // FIND THE SINGLE ORDER
  const singleOrder = await findDocumentByIdAndModel({
    id: productId,
    MyModel: SingleOrder,
  });
  // CHECK USER MATCHES WITH THE SINGLE ORDER USER
  if (req.user)
    userIdAndModelUserIdMatchCheck({
      user: req.user,
      userId: singleOrder.user.toString(),
    });
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
  }: Omit<OrderClientReqInterface, "price | user"> = req.body;
  // EMPTY QUERY
  const query: Partial<Omit<OrderClientReqInterface, "priceVal">> = {};
  // SET QUERY KEY AND VALUES
  isShipping
    ? (query.isShipping = isShipping)
    : (query.isShipping = !isShipping);
  if (status) query.status = status;
  // IF USER IS NOT ADMIN THEN ADD TO QUERY OF THE USERS ID TO FIND ONLY RELATED SINGLE ORDERS
  if (req.user && req.user.userType !== "admin") query.user = req.user._id;
  if (priceVal) query.price = gteAndLteQueryForDb(priceVal);
  // ! HERE CALCULATE THE PRICE TO GBP
  // FIND ALL ORDERS WITH QUERY
  const order = Order.find(query);
  // COUNT THE DOCUMENTS
  const orderLength = order.countDocuments();
  // LIMIT AND SKIP
  const myLimit = 10;
  const { limit, skip } = limitAndSkip({ limit: myLimit, page: orderPage });
  const result = await order.skip(skip).limit(limit);
  // RESPONSE
  res
    .status(StatusCodes.OK)
    .json({ msg: "orders fetched", result, length: orderLength });
};

const getOrder: RequestHandler = async (req, res) => {
  // GET CLIENT SIDE QUERY
  const { order: orderId } = req.params;
  // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
  if (!orderId) throw new BadRequestError("order id is required");
  // FIND THE SINGLE ORDER
  const order = await findDocumentByIdAndModel({
    id: orderId,
    MyModel: Order,
  });
  // CHECK USER MATCHES WITH THE ORDER USER
  if (req.user)
    userIdAndModelUserIdMatchCheck({
      user: req.user,
      userId: order._id.toString(),
    });
  // RESPONSE
  res
    .status(StatusCodes.OK)
    .json({ msg: "single order fetched", result: order });
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
