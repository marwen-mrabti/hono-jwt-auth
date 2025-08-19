import type { Database } from 'bun:sqlite';

import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

import app from '.';
import { createTestDb } from './test/test-db';
import {
  DeleteUserRequest,
  extractTokenFromCookie,
  LoginRequest,
  LogoutRequest,
  SignupRequest,
} from './test/test-helpers';

let db: Database;

mock.module('./db/index.ts', () => {
  return { dbConnect: () => db };
});

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});

describe('signup endpoint', () => {
  it('should sign up a user', async () => {
    const email = 'test@test.com';
    const password = 'password123';

    const req = SignupRequest({ email, password });
    const res = await app.fetch(req);
    const json = await res.json();
    const cookies = res.headers.get('set-cookie');

    expect(res.status).toBe(201);
    expect(json).toEqual({
      message: 'User registered successfully',
      user: {
        id: expect.any(String),
        email,
      },
    });
    expect(cookies).toMatch(/authToken=/);
  });

  it('should return 409 if email already exists', async () => {
    const email = 'test@test.com';
    const password = 'password123';

    const req1 = SignupRequest({ email, password });
    const res1 = await app.fetch(req1);
    expect(res1.status).toBe(201);

    const req2 = SignupRequest({ email, password });
    const res2 = await app.fetch(req2);
    const json2 = await res2.json();

    expect(res2.status).toBe(409);
    expect(json2).toEqual({
      errors: ['Email already exists'],
    });
  });

  it('should return error if missing email or password', async () => {
    const req = SignupRequest({});
    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      errors: ['you need to provide a valid email', 'password is required'],
    });
  });
});

describe('login endpoint', () => {
  it('should login a user', async () => {
    const email = 'test@test.com';
    const password = 'password123';

    //signup  a user
    const signupReq = SignupRequest({ email, password });
    const signupRes = await app.fetch(signupReq);

    expect(signupRes.status).toBe(201);

    // login a user
    const loginReq = LoginRequest({ email, password });
    const loginRes = await app.fetch(loginReq);
    const loginJson = await loginRes.json();
    const cookies = loginRes.headers.get('set-cookie');

    expect(loginRes.status).toBe(200);
    expect(loginJson).toEqual({
      message: 'Login successful',
      user: {
        id: expect.any(String),
        email: 'test@test.com',
      },
    });
    expect(cookies).toMatch(/authToken=/);
  });

  it('should return 400 if missing email or password', async () => {
    const loginReq = LoginRequest({});
    const loginRes = await app.fetch(loginReq);
    const loginJson = await loginRes.json();

    expect(loginRes.status).toBe(400);
    expect(loginJson).toEqual({
      errors: ['you need to provide a valid email', 'password is required'],
    });
  });

  it('should return 401 if the password provided is not valid', async () => {
    const email = 'test@test.com';
    const password = 'password123';

    //signup  a user
    const signupReq = SignupRequest({ email, password });
    const signupRes = await app.fetch(signupReq);

    expect(signupRes.status).toBe(201);

    // login a user
    const loginReq = LoginRequest({ email, password: 'wrongPassword' });
    const loginRes = await app.fetch(loginReq);
    const loginJson = await loginRes.json();

    expect(loginRes.status).toBe(401);
    expect(loginJson).toEqual({
      errors: ['Invalid Credentials'],
    });
  });
});

describe('logout endpoint', () => {
  it('should logout a user', async () => {
    const email = 'test@test.com';
    const password = 'password123';
    //signup  a user
    const signupReq = SignupRequest({ email, password });
    const signupRes = await app.fetch(signupReq);
    expect(signupRes.status).toBe(201);

    // login a user
    const loginReq = LoginRequest({ email, password });
    const loginRes = await app.fetch(loginReq);
    expect(loginRes.status).toBe(200);

    // logout
    const logoutReq = LogoutRequest();
    const logoutRes = await app.fetch(logoutReq);
    const logoutJson = await logoutRes.json();
    const cookies = logoutRes.headers.get('set-cookie');

    expect(logoutRes.status).toBe(200);
    expect(cookies).toMatch(/authToken=;/);
    expect(logoutJson).toEqual({
      message: 'user logged out successfully.',
    });
  });
});

describe('delete user endpoint', () => {
  it('should delete the user with the given id', async () => {
    const email = 'test@test.com';
    const password = 'password123';

    // insert a user and get the user id
    const signupReq = SignupRequest({ email, password });
    const signupRes = await app.fetch(signupReq);
    const signupJson = await signupRes.json();
    const cookies = signupRes.headers.get('set-cookie');
    expect(signupRes.status).toBe(201);
    expect(cookies).toMatch(/authToken=/);

    // send a delete user request
    const authToken = extractTokenFromCookie(cookies, 'authToken');
    const req = DeleteUserRequest(signupJson.user.id, authToken);
    const res = await app.fetch(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({
      message: 'User deleted successfully',
    });
  });
});
