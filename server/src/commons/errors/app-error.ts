import { ErrorCode } from '@id6/commons/build/error-code';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly errorCode: ErrorCode,
    public readonly errorDetails?: any,
  ) {
    super(message);
  }
}
