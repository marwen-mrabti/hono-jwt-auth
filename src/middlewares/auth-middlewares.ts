import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { loginSchema, signupSchema } from '../schemas/auth-schema';

export const signupValidator = zValidator('json', signupSchema, (result, c) => {
  if (!result.success) {
    const errors = z.flattenError(result.error);
    return c.json(
      {
        errors: errors.fieldErrors,
      },
      400
    );
  }
});

export const loginValidator = zValidator('json', loginSchema, (result, c) => {
  if (!result.success) {
    const errors = z.flattenError(result.error);
    return c.json(
      {
        errors: errors.fieldErrors,
      },
      400
    );
  }
});
