class ErrorResponse extends Error {
  constructor(message: any, statusCode: any) {
    super(message);
    // @ts-ignore
    this.statusCode = statusCode;
    // @ts-ignore
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse
