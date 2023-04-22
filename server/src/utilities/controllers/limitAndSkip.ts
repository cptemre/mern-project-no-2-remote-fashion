const limitAndSkip = ({ limit, page }: { limit: number; page: number }) => {
  const skip = limit * page ? page - 1 : 0;

  return { limit, skip };
};

export default limitAndSkip;
