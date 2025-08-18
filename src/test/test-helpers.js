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
exports.extractTokenFromCookie = exports.deleteUserRequest = exports.SignupRequest = void 0;
function SignupRequest(_a) {
  return __awaiter(void 0, [_a], void 0, function (_b) {
    const _c = _b.email; const email = _c === void 0 ? "testsignup@test.com" : _c; const _d = _b.password; const password = _d === void 0 ? "1234567890" : _d;
    return __generator(this, (_e) => {
      return [2 /* return */, new Request("http://localhost:9000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })];
    });
  });
}
exports.SignupRequest = SignupRequest;
function deleteUserRequest(userId, authToken) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, (_a) => {
      return [2 /* return */, new Request("http://localhost:9000/api/auth/user/delete/".concat(userId), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ".concat(authToken),
        },
      })];
    });
  });
}
exports.deleteUserRequest = deleteUserRequest;
function extractTokenFromCookie(cookieString, cookieName) {
  if (cookieName === void 0) { cookieName = "authToken"; }
  if (!cookieString) {
    return null;
  }
  // Find the cookie name in the string
  const cookieStart = cookieString.indexOf("".concat(cookieName, "="));
  if (cookieStart === -1) {
    return null; // Cookie not found
  }
  // Get the position after the cookie name and equals sign
  const tokenStart = cookieStart + cookieName.length + 1;
  // Find the end of the token (either semicolon or end of string)
  const tokenEnd = cookieString.indexOf(";", tokenStart);
  // Extract the token
  if (tokenEnd === -1) {
    // Token goes to the end of the string
    return cookieString.substring(tokenStart).trim();
  }
  else {
    // Token ends at semicolon
    return cookieString.substring(tokenStart, tokenEnd).trim();
  }
}
exports.extractTokenFromCookie = extractTokenFromCookie;
