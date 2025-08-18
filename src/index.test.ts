import type { Database } from "bun:sqlite";

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

import app from ".";
import { createTestDb } from "./test/test-db";
import {
  deleteUserRequest,
  extractTokenFromCookie,
  SignupRequest,
} from "./test/test-helpers";

let db: Database;

mock.module("./db/index.ts", () => {
  return { dbConnect: () => db };
});

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});

describe("signup endpoint", () => {
  it("should sign up a user", async () => {
    const req = await SignupRequest({});
    const res = await app.fetch(req);
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json).toEqual({
      message: "User registered successfully",
      user: {
        id: expect.any(String),
        email: "testsignup@test.com",
      },
    });
    const cookies = res.headers.get("set-cookie");
    expect(cookies).toMatch(/authToken=/);
  });

  it("should return 409 if email already exists", async () => {
    const req1 = await SignupRequest({});
    const res1 = await app.fetch(req1);
    expect(res1.status).toBe(201);

    const req2 = await SignupRequest({});
    const res2 = await app.fetch(req2);
    const json2 = await res2.json();

    expect(res2.status).toBe(409);
    expect(json2).toEqual({
      errors: ["Email already exists"],
    });
  });

  it("should return error if missing email or password", async () => {
    const email = "";
    const password = "123456790";
    const req = await SignupRequest({ email, password });
    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      errors: {
        email: ["you need to provide a valid email"],
        password: ["Password must be at least 10 characters long."],
      },
    });
  });
});

describe("delete user endpoint", () => {
  it("should delete the user with the given id", async () => {
    // insert a user and get the user id
    const signupReq = await SignupRequest({});
    const signupRes = await app.fetch(signupReq);
    const signupJson = await signupRes.json();
    const cookies = signupRes.headers.get("set-cookie");
    const authToken = extractTokenFromCookie(cookies, "authToken");

    // send a delete user request
    const req = await deleteUserRequest(signupJson.user.id, authToken);
    const res = await app.fetch(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({
      message: "User deleted successfully",
    });
  });
});
