import { Database } from 'bun:sqlite';
import { type UUID, randomUUID } from 'crypto';
import {
  DatabaseError,
  UserConflictError,
  UserNotFoundError,
} from '../lib/errors';
import type { T_User } from '../schemas/auth-schema';

export const insertUser = async ({
  db,
  email,
  password,
}: {
  db: Database;
  email: string;
  password: string;
}): Promise<UUID> => {
  try {
    const userId = randomUUID();

    const passwordHash = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 6,
    });

    const insertQuery = db.query(`
      INSERT INTO USERS (id, email, password_hash)
      VALUES (:id, :email, :passwordHash)
      RETURNING id
    `);

    const user = insertQuery.get({ id: userId, email, passwordHash }) as {
      id: UUID;
    } | null;

    if (!user) {
      throw new DatabaseError('Failed to insert user');
    }

    return user.id;
  } catch (error) {
    // Handle SQLite unique constraint violation
    if (
      error instanceof Error &&
      error.message.includes('UNIQUE constraint failed')
    ) {
      throw new UserConflictError('User with this email already exists');
    }

    if (error instanceof UserConflictError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError('Failed to create user', error as Error);
  }
};

export const getUserByEmail = async ({
  db,
  email,
}: {
  db: Database;
  email: string;
}): Promise<{ id: UUID; password_hash: string } | null> => {
  try {
    const userQuery = db.query(`
      SELECT id, password_hash FROM USERS WHERE email = :email
    `);

    const user = userQuery.get({ email }) as {
      id: UUID;
      password_hash: string;
    } | null;

    return user;
  } catch (error) {
    throw new DatabaseError('Failed to fetch user by email', error as Error);
  }
};

export const getUserById = async ({
  db,
  userId,
}: {
  db: Database;
  userId: UUID | string;
}): Promise<T_User | null> => {
  try {
    const userQuery = db.query(`
      SELECT * FROM USERS WHERE id = :id
    `);

    const user = userQuery.get({ id: userId }) as T_User | null;
    return user;
  } catch (error) {
    throw new DatabaseError('Failed to fetch user by ID', error as Error);
  }
};

export const deleteUser = async ({
  db,
  userId,
}: {
  db: Database;
  userId: UUID | string;
}): Promise<void> => {
  try {
    const deleteQuery = db.query(`
      DELETE FROM USERS WHERE id = :id
    `);

    const result = deleteQuery.run({ id: userId });

    // If no rows were affected, user doesn't exist
    if (result.changes === 0) {
      throw new UserNotFoundError(`User with ID ${userId} not found`);
    }
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      throw error;
    }
    throw new DatabaseError('Failed to delete user', error as Error);
  }
};
