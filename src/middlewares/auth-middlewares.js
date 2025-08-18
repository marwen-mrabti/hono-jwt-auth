"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidator = void 0;
const zod_validator_1 = require("@hono/zod-validator");
const zod_1 = require("zod");

const auth_schema_1 = require("../schemas/auth-schema");

exports.signupValidator = (0, zod_validator_1.zValidator)("json", auth_schema_1.signupSchema, (result, c) => {
  if (!result.success) {
    const errors = zod_1.z.flattenError(result.error);
    return c.json({
      errors: errors.fieldErrors,
    }, 400);
  }
});
