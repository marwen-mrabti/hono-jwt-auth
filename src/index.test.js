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

const _1 = require(".");
const test_db_1 = require("./test/test-db");
const test_helpers_1 = require("./test/test-helpers");

let db;
bun_test_1.mock.module("./db/index.ts", () => {
  return { dbConnect() { return db; } };
});
(0, bun_test_1.beforeEach)(() => {
  db = (0, test_db_1.createTestDb)();
});
(0, bun_test_1.afterEach)(() => {
  db.close();
});
(0, bun_test_1.describe)("signup endpoint", () => {
  (0, bun_test_1.it)("should sign up a user", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let req, res, json, cookies;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0: return [4 /* yield */, (0, test_helpers_1.SignupRequest)({})];
          case 1:
            req = _a.sent();
            return [4 /* yield */, _1.default.fetch(req)];
          case 2:
            res = _a.sent();
            return [4 /* yield */, res.json()];
          case 3:
            json = _a.sent();
            (0, bun_test_1.expect)(res.status).toBe(201);
            (0, bun_test_1.expect)(json).toEqual({
              message: "User registered successfully",
              user: {
                id: bun_test_1.expect.any(String),
                email: "testsignup@test.com",
              },
            });
            cookies = res.headers.get("set-cookie");
            (0, bun_test_1.expect)(cookies).toMatch(/authToken=/);
            return [2];
        }
      });
    });
  });
  (0, bun_test_1.it)("should return 409 if email already exists", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let req1, res1, req2, res2, json2;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0: return [4 /* yield */, (0, test_helpers_1.SignupRequest)({})];
          case 1:
            req1 = _a.sent();
            return [4 /* yield */, _1.default.fetch(req1)];
          case 2:
            res1 = _a.sent();
            (0, bun_test_1.expect)(res1.status).toBe(201);
            return [4 /* yield */, (0, test_helpers_1.SignupRequest)({})];
          case 3:
            req2 = _a.sent();
            return [4 /* yield */, _1.default.fetch(req2)];
          case 4:
            res2 = _a.sent();
            return [4 /* yield */, res2.json()];
          case 5:
            json2 = _a.sent();
            (0, bun_test_1.expect)(res2.status).toBe(409);
            (0, bun_test_1.expect)(json2).toEqual({
              errors: ["Email already exists"],
            });
            return [2];
        }
      });
    });
  });
  (0, bun_test_1.it)("should return error if missing email or password", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let email, password, req, res, json;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0:
            email = "";
            password = "123456790";
            return [4 /* yield */, (0, test_helpers_1.SignupRequest)({ email, password })];
          case 1:
            req = _a.sent();
            return [4 /* yield */, _1.default.fetch(req)];
          case 2:
            res = _a.sent();
            return [4 /* yield */, res.json()];
          case 3:
            json = _a.sent();
            (0, bun_test_1.expect)(res.status).toBe(400);
            (0, bun_test_1.expect)(json).toEqual({
              errors: {
                email: ["you need to provide a valid email"],
                password: ["Password must be at least 10 characters long."],
              },
            });
            return [2];
        }
      });
    });
  });
});
(0, bun_test_1.describe)("delete user endpoint", () => {
  (0, bun_test_1.it)("should delete the user with the given id", () => {
    return __awaiter(void 0, void 0, void 0, function () {
      let signupReq, signupRes, signupJson, cookies, authToken, req, res, json;
      return __generator(this, (_a) => {
        switch (_a.label) {
          case 0: return [4 /* yield */, (0, test_helpers_1.SignupRequest)({})];
          case 1:
            signupReq = _a.sent();
            return [4 /* yield */, _1.default.fetch(signupReq)];
          case 2:
            signupRes = _a.sent();
            return [4 /* yield */, signupRes.json()];
          case 3:
            signupJson = _a.sent();
            cookies = signupRes.headers.get("set-cookie");
            authToken = (0, test_helpers_1.extractTokenFromCookie)(cookies, "authToken");
            return [4 /* yield */, (0, test_helpers_1.deleteUserRequest)(signupJson.user.id, authToken)];
          case 4:
            req = _a.sent();
            return [4 /* yield */, _1.default.fetch(req)];
          case 5:
            res = _a.sent();
            return [4 /* yield */, res.json()];
          case 6:
            json = _a.sent();
            (0, bun_test_1.expect)(res.status).toBe(200);
            (0, bun_test_1.expect)(json).toEqual({
              message: "User deleted successfully",
            });
            return [2];
        }
      });
    });
  });
});
