interface PriceQueryInterface {
  price: { $gte: number | undefined; $lte: number | undefined };
}

export default PriceQueryInterface;
