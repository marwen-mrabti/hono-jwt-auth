import { Database } from 'bun:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { createTestDb } from '../test/test-db';
import { getUserByEmail, getUserById, insertUser } from './queries';
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
    await insertUser({ db, email, password });
    try {
      await insertUser({ db, email, password });
    } catch (error) {
      // console.log('🚧 unique email ', error);
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
      // console.log('🚨 empty password', error);
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

  it('should return null if the email is not in the Database', async () => {
    const email = 'testemail02@test.com';
    const user = await getUserByEmail({ db, email });
    expect(user).toBeNull();
  });
});

describe('getUserById', () => {
  it('should return a user with the given id', async () => {
    const email = 'test01@test.com';
    const password = '0123456789';

    const userId = await insertUser({ db, email, password });
    const user = await getUserById({ db, userId });
    expect(user).toBeDefined();
  });

  it('should return null if the user id is not in the Database', async () => {
    const userId = 'not in the db';
    const user = await getUserById({ db, userId });
    expect(user).toBeNull();
  });
});
