import { AnySchema, custom } from 'joi';

export function transform<T = string>(fn: (val: T) => any, schema: AnySchema): AnySchema {
  return custom(val => {
    const transformedValue = fn(val);
    const { value, error } = schema.validate(transformedValue);
    if (error) {
      throw error;
    }
    return value;
  });
}
