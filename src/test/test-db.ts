import { Database } from 'bun:sqlite';
import { applySchema } from '../db';

export const createTestDb = (): Database => {
  const db = new Database(':memory:');
  applySchema(db);
  db.exec(`PRAGMA journal_mode = WAL;`);
  return db;
};
