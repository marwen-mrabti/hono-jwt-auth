import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.email('you need to provide a valid email'),
  password: z
    .string()
    .min(10, { message: 'Password must be at least 10 characters long.' }),
  favorite_color: z.string().max(20, 'too long').optional(),
  favorite_animal: z.string().max(20, 'too long').optional(),
});

const userSchema = signupSchema.extend({
  id: z.uuid(),
});

export type T_User = z.infer<typeof userSchema>;

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
