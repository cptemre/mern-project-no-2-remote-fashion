interface GetAllProductsReqBodyInterface {
  name: string;
  brand: string;
  color: string;
  size: string;
  price: string;
  isReview: string;
  isStock: string;
  rating: string;
  gender: "M" | "F" | "B";
  page: string;
  myProducts: string;
}

export default GetAllProductsReqBodyInterface;
