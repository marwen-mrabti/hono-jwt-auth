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
const bun_test_1 = require("bun:test");

const test_db_1 = require("../test/test-db");
const queries_1 = require("./queries");

let db;
(0, bun_test_1.beforeEach)(() => {
  db = (0, test_db_1.createTestDb)();
});
(0, bun_test_1.afterEach)(() => {
  db.close();
});
(0, bun_test_1.describe)("insertUser", () => {
  (0, bun_test_1.it)("should insert user in the Database", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let email, password, userId;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            email = "test01@test.com";
            password = "0123456789";
            return [4 /* yield */, (0, queries_1.insertUser)({ db, email, password })];
          case 1:
            userId = _a.sent();
            (0, bun_test_1.expect)(userId).toBeDefined();
            return [2];
        }
      });
    });
  });
  (0, bun_test_1.it)("should throw an error if the email is already in the Database", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let email, password, error_1;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            email = "test01@test.com";
            password = "0123456789";
            return [4 /* yield */, (0, queries_1.insertUser)({ db, email, password })];
          case 1:
            _a.sent();
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4, , 5]);
            return [4 /* yield */, (0, queries_1.insertUser)({ db, email, password })];
          case 3:
            _a.sent();
            return [3 /* break */, 5];
          case 4:
            error_1 = _a.sent();
            // console.log('🚧 unique email ', error);
            (0, bun_test_1.expect)(error_1).toBeInstanceOf(Error);
            if (error_1 instanceof Error) {
              (0, bun_test_1.expect)(error_1.message).toInclude("email already exists");
            }
            return [3 /* break */, 5];
          case 5: return [2];
        }
      });
    });
  });
  (0, bun_test_1.it)("should throw an error if the password is empty", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let email, password, error_2;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            email = "test04@test.com";
            password = "";
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4 /* yield */, (0, queries_1.insertUser)({ db, email, password })];
          case 2:
            _a.sent();
            return [3 /* break */, 4];
          case 3:
            error_2 = _a.sent();
            // console.log('🚨 empty password', error);
            (0, bun_test_1.expect)(error_2).toBeInstanceOf(Error);
            if (error_2 instanceof Error) {
              (0, bun_test_1.expect)(error_2.message).toMatch(/password must not be empty/);
            }
            return [3 /* break */, 4];
          case 4: return [2];
        }
      });
    });
  });
});
(0, bun_test_1.describe)("getUserByEmail", () => {
  (0, bun_test_1.it)("should return the user with the given email", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let email, password, user;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            email = "testemail02@test.com";
            password = "0123456789";
            return [4 /* yield */, (0, queries_1.insertUser)({ db, email, password })];
          case 1:
            _a.sent();
            return [4 /* yield */, (0, queries_1.getUserByEmail)({ db, email })];
          case 2:
            user = _a.sent();
            (0, bun_test_1.expect)(user).toBeDefined();
            return [2];
        }
      });
    });
  });
  (0, bun_test_1.it)("should return null if the email is not in the Database", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let email, user;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            email = "testemail02@test.com";
            return [4 /* yield */, (0, queries_1.getUserByEmail)({ db, email })];
          case 1:
            user = _a.sent();
            (0, bun_test_1.expect)(user).toBeNull();
            return [2];
        }
      });
    });
  });
});
(0, bun_test_1.describe)("getUserById", () => {
  (0, bun_test_1.it)("should return a user with the given id", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let email, password, userId, user;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            email = "test01@test.com";
            password = "0123456789";
            return [4 /* yield */, (0, queries_1.insertUser)({ db, email, password })];
          case 1:
            userId = _a.sent();
            return [4 /* yield */, (0, queries_1.getUserById)({ db, userId })];
          case 2:
            user = _a.sent();
            (0, bun_test_1.expect)(user).toBeDefined();
            return [2];
        }
      });
    });
  });
  (0, bun_test_1.it)("should return null if the user id is not in the Database", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let userId, user;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            userId = "not in the db";
            return [4 /* yield */, (0, queries_1.getUserById)({ db, userId })];
          case 1:
            user = _a.sent();
            (0, bun_test_1.expect)(user).toBeNull();
            return [2];
        }
      });
    });
  });
});
