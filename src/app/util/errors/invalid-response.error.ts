export class InvalidResponseError extends Error {
  static override readonly name = 'InvalidResponseError';
  constructor(message: string) {
    super(message);
    this.name = InvalidResponseError.name;
  }
}
