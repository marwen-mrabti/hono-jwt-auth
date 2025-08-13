import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { signupSchema } from '../schemas/auth-schema';

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

