import { AnySchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { JOI_OPTIONS } from '../../constants';
import { BadRequestError } from '../errors/bad-request-error';
import { ErrorCode } from '@id6/commons/build/error-code';

export function params($schema: AnySchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    $schema
      .validateAsync(req.params, JOI_OPTIONS)
      .then(() => {
        // aapparently this has no effect
        // req.params = value;
        next();
      })
      .catch(err => {
        next(new BadRequestError('Invalid params', ErrorCode.invalid_params, err.details));
      });
  };
}
