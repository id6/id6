import { object, Schema } from 'joi';

export type EnvSpec<E = any> = { [varName in keyof E]: Schema };

export function parseEnv(spec: EnvSpec, processEnv: any = process.env): any {
  const schema = object(spec).required();

  const { error, value } = schema.validate(processEnv, {
    convert: true,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map(({ message }) => `- ${message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  return value;
}
