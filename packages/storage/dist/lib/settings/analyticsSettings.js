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
function generateAnonymousUserId() {
  return "anon_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
export const DEFAULT_ANALYTICS_SETTINGS = {
  enabled: true,
  anonymousUserId: ""
};
const storage = createStorage("analytics-settings", DEFAULT_ANALYTICS_SETTINGS, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true
});
export const analyticsSettingsStore = __spreadProps(__spreadValues({}, storage), {
  updateSettings(settings) {
    return __async(this, null, function* () {
      const currentSettings = (yield storage.get()) || DEFAULT_ANALYTICS_SETTINGS;
      const updatedSettings = __spreadValues(__spreadValues({}, currentSettings), settings);
      yield storage.set(updatedSettings);
    });
  },
  getSettings() {
    return __async(this, null, function* () {
      const settings = yield storage.get();
      if (!(settings == null ? void 0 : settings.anonymousUserId)) {
        const newSettings = __spreadProps(__spreadValues(__spreadValues({}, DEFAULT_ANALYTICS_SETTINGS), settings), {
          anonymousUserId: generateAnonymousUserId()
        });
        yield storage.set(newSettings);
        return newSettings;
      }
      return __spreadValues(__spreadValues({}, DEFAULT_ANALYTICS_SETTINGS), settings);
    });
  },
  resetToDefaults() {
    return __async(this, null, function* () {
      const currentSettings = yield storage.get();
      const resetSettings = __spreadProps(__spreadValues({}, DEFAULT_ANALYTICS_SETTINGS), {
        anonymousUserId: (currentSettings == null ? void 0 : currentSettings.anonymousUserId) || generateAnonymousUserId()
      });
      yield storage.set(resetSettings);
    });
  },
  generateAnonymousUserId
});
//# sourceMappingURL=analyticsSettings.js.map
