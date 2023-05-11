// SEARCH REGEX FUNCTION
const createMongooseRegex = (regex: string) => {
  const searchRegex = { $regex: `${regex}`, $options: "i" };
  return searchRegex;
};

export default createMongooseRegex;
