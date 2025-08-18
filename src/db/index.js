"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySchema = exports.dbConnect = void 0;
const bun_sqlite_1 = require("bun:sqlite");
const path_1 = require("node:path");

const dbPath = (0, path_1.join)(".", "db.sqlite");
let db;
function dbConnect() {
  if (!db) {
    db = new bun_sqlite_1.Database(dbPath, { strict: true });
    console.log("db connected");
    db.exec("PRAGMA journal_mode = WAL;");
    (0, exports.applySchema)(db);
  }
  return db;
}
exports.dbConnect = dbConnect;
function applySchema(dbInstance) {
  dbInstance.exec("\n  CREATE TABLE IF NOT EXISTS USERS (\n    id TEXT PRIMARY KEY,\n    email TEXT UNIQUE NOT NULL,\n    password_hash TEXT NOT NULL,\n    favorite_color TEXT,\n    favorite_animal TEXT,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n  )\n");
}
exports.applySchema = applySchema;
