export class RequestParamError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, RequestParamError.prototype);
  }
}
