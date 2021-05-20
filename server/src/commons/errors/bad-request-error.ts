import { HttpError } from './http-error';
import { ErrorCode } from '@id6/commons/build/error-code';

export class BadRequestError extends HttpError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    json?: any,
  ) {
    super(400, message, errorCode, json);
  }
}
