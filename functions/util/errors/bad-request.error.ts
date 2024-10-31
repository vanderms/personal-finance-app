export class BadRequestError extends Error {
  static name: 'BadRequestError';

  constructor(message: string = '') {
    super(message);
    this.name = BadRequestError.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
