import type { Database } from 'bun:sqlite';
import type { UUID } from 'node:crypto';

import { randomUUID } from 'node:crypto';

import {
  DatabaseError,
  UserConflictError,
  UserNotFoundError,
} from '../lib/errors';

export async function insertUser({
  db,
  email,
  password,
}: {
  db: Database;
  email: string;
  password: string;
}): Promise<UUID> {
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

    const user = (await insertQuery.get({
      id: userId,
      email,
      passwordHash,
    })) as {
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

    const errorMessage =
      error instanceof Error ? error.message : 'failed to create user';
    throw new DatabaseError(
      errorMessage,
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

export async function getUserByEmail({
  db,
  email,
}: {
  db: Database;
  email: string;
}) {
  const userQuery = db.query(`
      SELECT id, password_hash FROM USERS WHERE email = :email
    `);

  const user = (await userQuery.get({ email })) as {
    id: UUID;
    password_hash: string;
  } | null;

  return user;
}

export async function getUserById({
  db,
  userId,
}: {
  db: Database;
  userId: string;
}) {
  try {
    const userQuery = db.query(`
      SELECT id, email, created_at  FROM USERS WHERE id = :id
    `);

    const user = (await userQuery.get({ id: userId })) as {
      id: string;
      email: string;
      created_at: Date;
    } | null;


    return user;
  } catch (error) {
    throw new DatabaseError('Failed to fetch user by ID', error as Error);
  }
}

export async function deleteUser({
  db,
  userId,
}: {
  db: Database;
  userId: UUID | string;
}): Promise<void> {
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
}
