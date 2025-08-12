import { Database } from 'bun:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { createTestDb } from '../test/test-db';
import { getUserByEmail, insertUser } from './queries';
let db: Database;

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});

describe('insertUser', () => {
  it('should insert user in the Database', async () => {
    const email = 'test01@test.com';
    const password = '0123456789';
    const userId = await insertUser({ db, email, password });
    expect(userId).toBeDefined();
  });

  it('should throw an error if the email is already in the Database', async () => {
    const email = 'test01@test.com';
    const password = '0123456789';
    try {
      await insertUser({ db, email, password });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toMatch(/UNIQUE constraint failed/);
      }
    }
  });

  it('should throw an error if the password is empty', async () => {
    const email = 'test04@test.com';
    const password = '';
    try {
      await insertUser({ db, email, password });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toMatch(/password must not be empty/);
      }
    }
  });
});

describe('getUserByEmail', () => {
  it('should return the user with the given email', async () => {
    const email = 'testemail02@test.com';
    const password = '0123456789';
    await insertUser({ db, email, password });

    const user = await getUserByEmail({ db, email });
    expect(user).toBeDefined();
  });
});
