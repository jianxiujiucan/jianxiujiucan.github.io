export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export function httpError(status: number, code: string, message: string): HttpError {
  return new HttpError(status, code, message)
}
