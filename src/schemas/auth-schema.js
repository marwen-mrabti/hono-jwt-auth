"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = exports.userSchema = void 0;
const zod_1 = require("zod");

exports.userSchema = zod_1.z.object({
  id: zod_1.z.uuid(),
  email: zod_1.z.email("you need to provide a valid email"),
  password: zod_1.z
    .string()
    .min(10, { message: "Password must be at least 10 characters long." }),
  favorite_color: zod_1.z.string().max(20, "too long").optional(),
  favorite_animal: zod_1.z.string().max(20, "too long").optional(),
  created_at: zod_1.z.date().default(new Date()),
  updated_at: zod_1.z.date().default(new Date()),
});
exports.signupSchema = exports.userSchema.pick({
  email: true,
  password: true,
});
