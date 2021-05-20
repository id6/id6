import { HttpError } from './http-error';
import { ErrorCode } from '@id6/commons/build/error-code';

export class NotFoundError extends HttpError {
  constructor(
    message = 'Resource not found',
    errorCode: ErrorCode = ErrorCode.resource_not_found,
    json?: { type: string },
  ) {
    super(404, message, errorCode, json || { type: 'Resource' });
  }
}
