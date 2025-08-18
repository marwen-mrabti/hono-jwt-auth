"use strict";
const __extends = (this && this.__extends) || (function () {
  let extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf
      || (Array.isArray({ __proto__: [] }) && function (d, b) { d.__proto__ = b; })
      || function (d, b) {
        for (const p in b) {
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
        }
      };
    return extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError(`Class extends value ${String(b)} is not a constructor or null`);
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.UserConflictError = exports.UserNotFoundError = void 0;
const UserNotFoundError = /** @class */ (function (_super) {
  __extends(UserNotFoundError, _super);
  function UserNotFoundError(message) {
    if (message === void 0) { message = "User not found"; }
    const _this = _super.call(this, message) || this;
    _this.name = "UserNotFoundError";
    return _this;
  }
  return UserNotFoundError;
}(Error));
exports.UserNotFoundError = UserNotFoundError;
const UserConflictError = /** @class */ (function (_super) {
  __extends(UserConflictError, _super);
  function UserConflictError(message) {
    if (message === void 0) { message = "User already exists"; }
    const _this = _super.call(this, message) || this;
    _this.name = "UserConflictError";
    return _this;
  }
  return UserConflictError;
}(Error));
exports.UserConflictError = UserConflictError;
const DatabaseError = /** @class */ (function (_super) {
  __extends(DatabaseError, _super);
  function DatabaseError(message, originalError) {
    const _this = _super.call(this, message) || this;
    _this.originalError = originalError;
    _this.name = "DatabaseError";
    return _this;
  }
  return DatabaseError;
}(Error));
exports.DatabaseError = DatabaseError;
