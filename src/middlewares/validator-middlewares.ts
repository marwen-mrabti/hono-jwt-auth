import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { loginSchema, paramSchema, signupSchema } from '../schemas/auth-schema';

export const createValidator = <T extends z.ZodSchema>(
  schema: T,
  target: 'json' | 'form' | 'query' | 'param' | 'header' = 'json'
) => {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);

      return c.json(
        {
          errors: errors,
        },
        400
      );
    }
  });
};

export const signupValidator = createValidator(signupSchema);
export const loginValidator = createValidator(loginSchema);

export const paramValidator = createValidator(paramSchema, 'param');
// export const queryValidator = createValidator(querySchema, 'query');
