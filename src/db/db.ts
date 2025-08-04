import { Database } from "bun:sqlite";
import { join } from "path";

const dbPath = join(".", "db.sqlite");

let db: Database;

export const dbConnect = () => {
  if (!db) {
    db = new Database(dbPath);
    console.log("db connected");
    db.exec("PRAGMA journal_mode = WAL;");

    applySchema(db);
  }
  return db;
};

const applySchema = (dbInstance: Database) => {
  dbInstance.exec(`
  CREATE TABLE IF NOT EXISTS USERS (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    favorite_color TEXT,
    favorite_animal TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  )
`);
};
