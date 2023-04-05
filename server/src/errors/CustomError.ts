class CustomError extends Error {
  protected constructor(public message: string) {
    super(message);
  }
}

export default CustomError;
