export default class NotFoundException extends Error {
  public readonly status: number = 404;

  constructor(message: string) {
    super(message);
  }
}
