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
export const DEFAULT_GENERAL_SETTINGS = {
  maxSteps: 100,
  maxActionsPerStep: 5,
  maxFailures: 3,
  useVision: false,
  useVisionForPlanner: false,
  planningInterval: 3,
  displayHighlights: true,
  minWaitPageLoad: 250,
  replayHistoricalTasks: false
};
const storage = createStorage("general-settings", DEFAULT_GENERAL_SETTINGS, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true
});
export const generalSettingsStore = __spreadProps(__spreadValues({}, storage), {
  updateSettings(settings) {
    return __async(this, null, function* () {
      const currentSettings = (yield storage.get()) || DEFAULT_GENERAL_SETTINGS;
      const updatedSettings = __spreadValues(__spreadValues({}, currentSettings), settings);
      if (updatedSettings.useVision && !updatedSettings.displayHighlights) {
        updatedSettings.displayHighlights = true;
      }
      yield storage.set(updatedSettings);
    });
  },
  getSettings() {
    return __async(this, null, function* () {
      const settings = yield storage.get();
      return __spreadValues(__spreadValues({}, DEFAULT_GENERAL_SETTINGS), settings);
    });
  },
  resetToDefaults() {
    return __async(this, null, function* () {
      yield storage.set(DEFAULT_GENERAL_SETTINGS);
    });
  }
});
//# sourceMappingURL=generalSettings.js.map
