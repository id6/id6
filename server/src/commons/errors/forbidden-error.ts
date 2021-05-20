import { HttpError } from './http-error';
import { ErrorCode } from '@id6/commons/build/error-code';

export class ForbiddenError extends HttpError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    json?: any,
  ) {
    super(403, message, errorCode, json);
  }
}
