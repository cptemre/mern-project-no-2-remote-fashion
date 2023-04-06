interface ProductSchemaInterface {
  name: string;
  brand: string;
  price: number;
  image: string[];
  description: string[];
  size: string[];
  gender: "M" | "F";
  category: "clothes" | "shoes";
  subCategory: string;
  numberOfReviews: Number;
  averageRating: Number;
}

export default ProductSchemaInterface;
