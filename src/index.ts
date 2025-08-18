import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
import { prettyJSON } from "hono/pretty-json";

import {
  deleteUserHandlers,
  getUserByIdHandlers,
  signUpHandlers,
} from "./handlers/auth-handlers";

const app = new Hono();

app
  // .use(logger())
  .use(prettyJSON())
  .use("/api/*", cors())
  .use("/api/*", csrf())
  .use(
    "/api/auth/*",
    jwt({ secret: process.env.JWT_SECRET!, cookie: "authToken" }),
  )
  .post("/api/signup", ...signUpHandlers)
  .get("/api/auth/user/:id", ...getUserByIdHandlers)
  .delete("/api/auth/user/delete/:id", ...deleteUserHandlers);

export default {
  port: Number(process.env.PORT) | 9000,
  fetch: app.fetch,
};
