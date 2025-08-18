import { z } from 'zod';

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email('you need to provide a valid email'),
  password: z
    .string()
    .min(10, { message: 'Password must be at least 10 characters long.' }),
  favorite_color: z.string().max(20, 'too long').optional(),
  favorite_animal: z.string().max(20, 'too long').optional(),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export type T_User = z.infer<typeof userSchema>;

export const signupSchema = userSchema.pick({
  email: true,
  password: true,
});

export const loginSchema = signupSchema.extend({
  password: z.string(),
});
