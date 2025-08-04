import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";

const app = new Hono();

app
  .use("/api/*", csrf())
  .use("/api/auth/*", jwt({ secret: process.env.JWT_SECRET!, cookie: "authToken" }))
  .get("/", (c) => c.text("Hello Hono!"))
  .get("/api/hello", (c) => c.text("Hello API!"));

export default {
  port: Number(process.env.PORT),
  fetch: app.fetch,
};
