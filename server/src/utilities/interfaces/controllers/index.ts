// AUTH
import RegisterVerificationInterface from "./auth/RegisterVerificationInterface";
import ResetPasswordInterface from "./auth/ResetPasswordInterface";
// PRODUCT
import GetAllProductsQueryInterface from "./product/GetAllProductsQueryInterface";
import GetAllProductsReqBodyInterface from "./product/GetAllProductsReqBodyInterface";
// ORDER
import {
  OrderClientReqInterface,
  SingleOrderQuery,
} from "./order/OrderQueryInterfaces";
// CUSTOM
import PriceQueryInterface from "./custom/PriceQueryInterface";
// GET USERS
import GetAllUsersInterface from "./user/GetAllUsersInterface";

export {
  RegisterVerificationInterface,
  ResetPasswordInterface,
  GetAllProductsQueryInterface,
  GetAllProductsReqBodyInterface,
  OrderClientReqInterface,
  PriceQueryInterface,
  SingleOrderQuery,
  GetAllUsersInterface,
};
