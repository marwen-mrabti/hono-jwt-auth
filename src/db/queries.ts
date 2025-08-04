import { Database } from "bun:sqlite";
import { type UUID, randomUUID } from "crypto";

export const insertUser = async ({
  db,
  email,
  password,
}: {
  db: Database;
  email: string;
  password: string;
}) => {
  const userId = randomUUID();

  const passwordHash = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 6,
  });

  const insertQuery = db.query(`
      INSERT INTO USERS (id, email, password_hash)
      values (?,?,?)
      RETURNING id
    `);

  const user = insertQuery.get(userId, email, passwordHash) as { id: UUID };
  return user.id;
};

export const getUserByEmail = (db: Database, email: string) => {};

export const getUserById = (db: Database, id: UUID) => {};
