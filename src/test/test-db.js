"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestDb = void 0;
const bun_sqlite_1 = require("bun:sqlite");

const db_1 = require("../db");

function createTestDb() {
  const db = new bun_sqlite_1.Database(":memory:", { strict: true });
  (0, db_1.applySchema)(db);
  db.exec("PRAGMA journal_mode = WAL;");
  return db;
}
exports.createTestDb = createTestDb;
