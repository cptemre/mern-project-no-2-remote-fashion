interface ImageSchemaInterface {
  originalName: string;
  cryptoName: string;
  mimeType: string;
  size: number;
  url: string;
  type: "product" | "avatar";
}

export default ImageSchemaInterface;
