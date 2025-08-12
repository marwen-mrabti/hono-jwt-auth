import { Database } from 'bun:sqlite';
import { type UUID, randomUUID } from 'crypto';

export const insertUser = async ({
  db,
  email,
  password,
  favorite_animal,
  favorite_color,
}: {
  db: Database;
  email: string;
  password: string;
  favorite_animal?: string;
  favorite_color?: string;
}) => {
  const userId = randomUUID();

  const passwordHash = await Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 6,
  });

  const insertQuery = db.query(`
      INSERT INTO USERS (id, email, password_hash, favorite_animal, favorite_color)
      values (?,?,?,?,?)
      RETURNING id
    `);

  const user = (await insertQuery.get(
    userId,
    email,
    passwordHash,
    favorite_animal ?? null,
    favorite_color ?? null
  )) as { id: UUID };
  return user.id;
};

export const getUserByEmail = ({
  db,
  email,
}: {
  db: Database;
  email: string;
}) => {
  const userQuery = db.query(`
    SELECT id, password_hash FROM USERS WHERE EMAIL = ?
    `);
  const user = userQuery.get(email) as {
    id: UUID;
    password_hash: string;
  } | null;

  return user;
};

export const getUserById = (db: Database, id: UUID) => {};
