export class HelixError extends Error {
  constructor(message, public readonly extensions?: any) {
    super(message);
  }
}
