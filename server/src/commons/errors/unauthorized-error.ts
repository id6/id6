import { HttpError } from './http-error';
import { ErrorCode } from '@id6/commons/build/error-code';

export class UnauthorizedError extends HttpError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    json?: any,
  ) {
    super(401, message || 'Unauthorized', errorCode, json);
  }
}
