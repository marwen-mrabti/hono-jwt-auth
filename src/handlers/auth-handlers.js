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
exports.deleteUserHandlers = exports.getUserByIdHandlers = exports.signUpHandlers = void 0;
const cookie_1 = require("hono/cookie");
const factory_1 = require("hono/factory");
const zod_1 = require("zod");

const db_1 = require("../db");
const queries_1 = require("../db/queries");
const helpers_1 = require("../helpers");
const errors_1 = require("../lib/errors");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");

const factory = (0, factory_1.createFactory)();
exports.signUpHandlers = factory.createHandlers(auth_middlewares_1.signupValidator, (c) => {
  return __awaiter(void 0, void 0, void 0, function () {
    let db, body, email, password, userId, token, error_1;
    return __generator(this, (_a) => {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          db = (0, db_1.dbConnect)();
          body = c.req.valid("json");
          email = body.email, password = body.password;
          return [4 /* yield */, (0, queries_1.insertUser)({
            db,
            email,
            password,
          })];
        case 1:
          userId = _a.sent();
          return [4 /* yield */, (0, helpers_1.generateToken)(userId)];
        case 2:
          token = _a.sent();
          // Set JWT token in cookies
          (0, cookie_1.setCookie)(c, "authToken", token, helpers_1.cookieOpts);
          // Send success response
          return [2 /* return */, c.json({
            message: "User registered successfully",
            user: {
              id: userId,
              email,
            },
          }, 201)];
        case 3:
          error_1 = _a.sent();
          if (error_1 instanceof errors_1.UserConflictError) {
            return [2 /* return */, c.json({
              errors: ["Email already exists"],
            }, 409)];
          }
          console.error("🚨 Signup error:", error_1);
          if (error_1 instanceof errors_1.DatabaseError) {
            return [2 /* return */, c.json({
              errors: ["Database error occurred. Please try again."],
            }, 500)];
          }
          return [2 /* return */, c.json({
            errors: ["Internal server error"],
          }, 500)];
        case 4: return [2];
      }
    });
  });
});
exports.getUserByIdHandlers = factory.createHandlers((c) => {
  return __awaiter(void 0, void 0, void 0, function () {
    let db, userId, user, error_2;
    return __generator(this, (_a) => {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          db = (0, db_1.dbConnect)();
          userId = c.req.param("id");
          if (!userId) {
            return [2 /* return */, c.json({
              errors: ["please provide a valid user id"],
            }, 400)];
          }
          return [4 /* yield */, (0, queries_1.getUserById)({ db, userId })];
        case 1:
          user = _a.sent();
          if (!user) {
            throw new errors_1.UserNotFoundError();
          }
          return [2 /* return */, c.json({ user })];
        case 2:
          error_2 = _a.sent();
          if (error_2 instanceof errors_1.UserNotFoundError) {
            return [2 /* return */, c.json({ errors: ["User not found"] }, 404)];
          }
          if (error_2 instanceof errors_1.DatabaseError) {
            return [2 /* return */, c.json({
              errors: ["Database error occurred. Please try again."],
            }, 500)];
          }
          return [2 /* return */, c.json({
            errors: ["Internal server error"],
          }, 500)];
        case 3: return [2];
      }
    });
  });
});
exports.deleteUserHandlers = factory.createHandlers((c) => {
  return __awaiter(void 0, void 0, void 0, function () {
    let db, userId, isIdValid, errors, error_3;
    return __generator(this, (_a) => {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          db = (0, db_1.dbConnect)();
          userId = c.req.param("id");
          // Validate userId parameter
          if (!userId) {
            return [2 /* return */, c.json({
              errors: ["User ID is required"],
            }, 400)];
          }
          isIdValid = zod_1.z
            .uuid("please provide a valid user id")
            .safeParse(userId);
          if (!isIdValid.success) {
            errors = zod_1.z.flattenError(isIdValid.error);
            console.log(errors);
            return [2 /* return */, c.json({
              errors: errors.formErrors,
            }, 400)];
          }
          return [4 /* yield */, (0, queries_1.deleteUser)({ db, userId })];
        case 1:
          _a.sent();
          return [2 /* return */, c.json({
            message: "User deleted successfully",
          }, 200)];
        case 2:
          error_3 = _a.sent();
          console.error("🚨 delete user error:", error_3);
          if (error_3 instanceof errors_1.UserNotFoundError) {
            return [2 /* return */, c.json({ errors: ["User not found"] }, 404)];
          }
          if (error_3 instanceof errors_1.DatabaseError) {
            return [2 /* return */, c.json({
              errors: ["Database error occurred. Please try again."],
            }, 500)];
          }
          return [2 /* return */, c.json({
            errors: ["Internal server error"],
          }, 500)];
        case 3: return [2];
      }
    });
  });
});
