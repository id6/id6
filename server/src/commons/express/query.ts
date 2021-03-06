import { AnySchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { JOI_OPTIONS } from '../../constants';
import { BadRequestError } from '../errors/bad-request-error';
import { ErrorCode } from '@id6/commons/build/error-code';

export function query($schema: AnySchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    $schema
      .validateAsync(req.query, JOI_OPTIONS)
      .then(value => {
        req.query = value;
        next(undefined);
      })
      .catch(err => {
        next(new BadRequestError('Invalid query', ErrorCode.invalid_query, err.details));
      });
  };
}
