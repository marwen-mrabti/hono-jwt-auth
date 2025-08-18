"use strict";
const __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
  if (pack || arguments.length === 2) {
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
let _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const csrf_1 = require("hono/csrf");
const jwt_1 = require("hono/jwt");
const pretty_json_1 = require("hono/pretty-json");

const auth_handlers_1 = require("./handlers/auth-handlers");

const app = new hono_1.Hono();
(_a = (_b = (_c = app
// .use(logger())
  .use((0, pretty_json_1.prettyJSON)())
  .use("/api/*", (0, cors_1.cors)())
  .use("/api/*", (0, csrf_1.csrf)())
  .use("/api/auth/*", (0, jwt_1.jwt)({ secret: process.env.JWT_SECRET, cookie: "authToken" })))
  .post
  .apply(_c, __spreadArray(["/api/signup"], auth_handlers_1.signUpHandlers, false)))
  .get
  .apply(_b, __spreadArray(["/api/auth/user/:id"], auth_handlers_1.getUserByIdHandlers, false)))
  .delete
  .apply(_a, __spreadArray(["/api/auth/user/delete/:id"], auth_handlers_1.deleteUserHandlers, false));
exports.default = {
  port: Number(process.env.PORT) | 9000,
  fetch: app.fetch,
};
