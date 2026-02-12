"use strict";
const __defProp = Object.defineProperty;
const __defProps = Object.defineProperties;
const __getOwnPropDescs = Object.getOwnPropertyDescriptors;
const __getOwnPropSymbols = Object.getOwnPropertySymbols;
const __hasOwnProp = Object.prototype.hasOwnProperty;
const __propIsEnum = Object.prototype.propertyIsEnumerable;
const __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
const __spreadValues = (a, b) => {
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
const __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    const fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    const rejected = (value) => {
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
