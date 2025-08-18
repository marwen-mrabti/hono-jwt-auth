"use strict";
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) {
      try { step(generator.next(value)); }
      catch (e) { reject(e); }
    }
    function rejected(value) {
      try { step(generator.throw(value)); }
      catch (e) { reject(e); }
    }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const __generator = (this && this.__generator) || function (thisArg, body) {
  let _ = { label: 0, sent() {
    if (t[0] & 1)
      throw t[1]; return t[1];
  }, trys: [], ops: [] }; let f; let y; let t; let g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g.throw = verb(1), g.return = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
            if (t[2])
              _.ops.pop();
            _.trys.pop(); continue;
        }
        op = body.call(thisArg, _);
      }
      catch (e) { op = [6, e]; y = 0; }
      finally { f = t = 0; }
    }
    if (op[0] & 5)
      throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserById = exports.getUserByEmail = exports.insertUser = void 0;
const crypto_1 = require("node:crypto");

const errors_1 = require("../lib/errors");

function insertUser(_a) {
  return __awaiter(void 0, [_a], void 0, function (_b) {
    let userId, passwordHash, insertQuery, user, error_1, errorMessage;
    const db = _b.db; const email = _b.email; const password = _b.password;
    return __generator(this, (_c) => {
      switch (_c.label) {
        case 0:
          _c.trys.push([0, 3, , 4]);
          userId = (0, crypto_1.randomUUID)();
          return [4 /* yield */, Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 6,
          })];
        case 1:
          passwordHash = _c.sent();
          insertQuery = db.query("\n      INSERT INTO USERS (id, email, password_hash)\n      VALUES (:id, :email, :passwordHash)\n      RETURNING id\n    ");
          return [4 /* yield */, insertQuery.get({
            id: userId,
            email,
            passwordHash,
          })];
        case 2:
          user = (_c.sent());
          if (!user) {
            throw new errors_1.DatabaseError("Failed to insert user");
          }
          return [2 /* return */, user.id];
        case 3:
          error_1 = _c.sent();
          // Handle SQLite unique constraint violation
          if (error_1 instanceof Error
            && error_1.message.includes("UNIQUE constraint failed")) {
            throw new errors_1.UserConflictError("User with this email already exists");
          }
          if (error_1 instanceof errors_1.UserConflictError || error_1 instanceof errors_1.DatabaseError) {
            throw error_1;
          }
          errorMessage = error_1 instanceof Error ? error_1.message : "failed to create user";
          throw new errors_1.DatabaseError(errorMessage, error_1 instanceof Error ? error_1 : new Error(String(error_1)));
        case 4: return [2];
      }
    });
  });
}
exports.insertUser = insertUser;
function getUserByEmail(_a) {
  return __awaiter(void 0, [_a], void 0, function (_b) {
    let userQuery, user;
    const db = _b.db; const email = _b.email;
    return __generator(this, (_c) => {
      try {
        userQuery = db.query("\n      SELECT id, password_hash FROM USERS WHERE email = :email\n    ");
        user = userQuery.get({ email });
        return [2 /* return */, user];
      }
      catch (error) {
        throw new errors_1.DatabaseError("Failed to fetch user by email", error);
      }
      return [2];
    });
  });
}
exports.getUserByEmail = getUserByEmail;
function getUserById(_a) {
  return __awaiter(void 0, [_a], void 0, function (_b) {
    let userQuery, user;
    const db = _b.db; const userId = _b.userId;
    return __generator(this, (_c) => {
      try {
        userQuery = db.query("\n      SELECT id, email, created_at  FROM USERS WHERE id = :id\n    ");
        user = userQuery.get({ id: userId });
        return [2 /* return */, user];
      }
      catch (error) {
        throw new errors_1.DatabaseError("Failed to fetch user by ID", error);
      }
      return [2];
    });
  });
}
exports.getUserById = getUserById;
function deleteUser(_a) {
  return __awaiter(void 0, [_a], void 0, function (_b) {
    let deleteQuery, result;
    const db = _b.db; const userId = _b.userId;
    return __generator(this, (_c) => {
      try {
        deleteQuery = db.query("\n      DELETE FROM USERS WHERE id = :id\n    ");
        result = deleteQuery.run({ id: userId });
        // If no rows were affected, user doesn't exist
        if (result.changes === 0) {
          throw new errors_1.UserNotFoundError("User with ID ".concat(userId, " not found"));
        }
      }
      catch (error) {
        if (error instanceof errors_1.UserNotFoundError) {
          throw error;
        }
        throw new errors_1.DatabaseError("Failed to delete user", error);
      }
      return [2];
    });
  });
}
exports.deleteUser = deleteUser;
