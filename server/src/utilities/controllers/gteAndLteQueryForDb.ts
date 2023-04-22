const gteAndLteQueryForDb = (price: string) => {
  // EXAMPLE: gte-50_lte-100
  const [gteString, lteString] = price.split("_");
  const priceVal: { $gte: number | undefined; $lte: number | undefined } = {
    $gte: undefined,
    $lte: undefined,
  };
  if (gteString && gteString.startsWith("gte-")) {
    // EXAMPLE: [gte,50]
    const gte: string[] = gteString.split("-");
    // EXAMPLE: 50
    let gteVal: number = Number(gte[1]);
    // {$gte: 50}
    priceVal.$gte = gteVal;
  }
  if (lteString && lteString.startsWith("lte-")) {
    // EXAMPLE: [lte,100]
    const lte: string[] = lteString.split("-");
    // EXAMPLE: 100
    let lteVal: number = Number(lte[1]);
    // {$lte: 100}
    priceVal.$lte = lteVal;
  }
  return priceVal;
};

export default gteAndLteQueryForDb;
