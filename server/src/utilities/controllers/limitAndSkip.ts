import { BadRequestError } from "../../errors";

const limitAndSkip = ({ limit, page }: { limit: number; page: number }) => {
  if (page && page < 1)
    throw new BadRequestError("page value can not be less than 1");
  const pageToSkip = page ? page - 1 : 0;
  const skip = limit * pageToSkip;
  return { limit, skip };
};

export default limitAndSkip;
