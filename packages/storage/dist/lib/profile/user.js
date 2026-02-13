"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { StorageEnum } from "../base/enums";
import { createStorage } from "../base/base";
export const DEFAULT_USER_PROFILE = {
  userId: "unknown"
};
const storage = createStorage("user-profile", DEFAULT_USER_PROFILE, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true
});
export const userStore = __spreadProps(__spreadValues({}, storage), {
  createProfile(profile) {
    return __async(this, null, function* () {
      const fullProfile = __spreadValues(__spreadValues({}, DEFAULT_USER_PROFILE), profile);
      yield storage.set(fullProfile);
    });
  },
  updateProfile(profile) {
    return __async(this, null, function* () {
      const currentProfile = (yield storage.get()) || DEFAULT_USER_PROFILE;
      yield storage.set(__spreadValues(__spreadValues({}, currentProfile), profile));
    });
  },
  getProfile() {
    return __async(this, null, function* () {
      const profile = yield storage.get();
      return profile || DEFAULT_USER_PROFILE;
    });
  },
  getUserId() {
    return __async(this, null, function* () {
      const profile = yield this.getProfile();
      if (!profile.userId) {
        const newUserId = crypto.randomUUID();
        yield this.updateProfile({ userId: newUserId });
        return newUserId;
      }
      return profile.userId;
    });
  }
});
//# sourceMappingURL=user.js.map
