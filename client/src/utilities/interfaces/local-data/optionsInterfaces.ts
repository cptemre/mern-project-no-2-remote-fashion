// !
type selectedOption = "PRODUCTS" | "ORDERS" | "USERS";

interface ProductsOptionsInterface {
  PRODUCTS: "NEW" | "BEST" | "ALL";
}
interface OrdersOptionsInterface {
  ORDERS: "SINGLE ORDERS" | "ALL ORDERS";
}

type AllSubOptions =
  | ProductsOptionsInterface["PRODUCTS"]
  | OrdersOptionsInterface["ORDERS"];

interface OptionsInterface {
  user: {
    PRODUCTS: ProductsOptionsInterface["PRODUCTS"][];
    ORDERS: OrdersOptionsInterface["ORDERS"][];
  };
}

interface AllOptions extends OptionsInterface {}

export type {
  selectedOption,
  ProductsOptionsInterface,
  OrdersOptionsInterface,
  AllSubOptions,
  OptionsInterface,
  AllOptions,
};
