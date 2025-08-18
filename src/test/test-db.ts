import { Database } from "bun:sqlite";

import { applySchema } from "../db";

export function createTestDb(): Database {
  const db = new Database(":memory:", { strict: true });
  applySchema(db);
  db.exec(`PRAGMA journal_mode = WAL;`);
  return db;
}
