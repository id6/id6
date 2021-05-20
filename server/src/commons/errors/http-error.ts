import { ErrorCode } from '@id6/commons/build/error-code';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errorCode: ErrorCode,
    public readonly errorDetails?: any,
  ) {
    super(message);
  }
}
