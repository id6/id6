import { AsyncValidationOptions } from 'joi';

export const JOI_OPTIONS: AsyncValidationOptions = {
  abortEarly: true,
  stripUnknown: true,
  convert: true,
};
