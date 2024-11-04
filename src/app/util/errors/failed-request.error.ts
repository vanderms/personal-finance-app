export class FailedRequestError extends Error {
  static override readonly name = 'FailedRequestError';
  constructor(message: string) {
    super(message);
    this.name = FailedRequestError.name;
  }
}
