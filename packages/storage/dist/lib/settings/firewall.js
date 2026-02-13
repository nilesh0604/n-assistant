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
function normalizeUrl(url) {
  return url.trim().toLowerCase().replace(/^https?:\/\//, "");
}
export const DEFAULT_FIREWALL_SETTINGS = {
  allowList: [],
  denyList: [],
  enabled: true
};
const storage = createStorage("firewall-settings", DEFAULT_FIREWALL_SETTINGS, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true
});
export const firewallStore = __spreadProps(__spreadValues({}, storage), {
  updateFirewall(settings) {
    return __async(this, null, function* () {
      const currentSettings = (yield storage.get()) || DEFAULT_FIREWALL_SETTINGS;
      yield storage.set(__spreadValues(__spreadValues({}, currentSettings), settings));
    });
  },
  getFirewall() {
    return __async(this, null, function* () {
      const settings = yield storage.get();
      return settings || DEFAULT_FIREWALL_SETTINGS;
    });
  },
  resetToDefaults() {
    return __async(this, null, function* () {
      yield storage.set(DEFAULT_FIREWALL_SETTINGS);
    });
  },
  addToAllowList(url) {
    return __async(this, null, function* () {
      const normalizedUrl = normalizeUrl(url);
      const currentSettings = yield this.getFirewall();
      if (!currentSettings.allowList.includes(normalizedUrl)) {
        const denyList = currentSettings.denyList.filter((item) => item !== normalizedUrl);
        yield this.updateFirewall({
          allowList: [...currentSettings.allowList, normalizedUrl],
          denyList
        });
      }
    });
  },
  removeFromAllowList(url) {
    return __async(this, null, function* () {
      const normalizedUrl = normalizeUrl(url);
      const currentSettings = yield this.getFirewall();
      yield this.updateFirewall({
        allowList: currentSettings.allowList.filter((item) => item !== normalizedUrl)
      });
    });
  },
  addToDenyList(url) {
    return __async(this, null, function* () {
      const normalizedUrl = normalizeUrl(url);
      const currentSettings = yield this.getFirewall();
      if (!currentSettings.denyList.includes(normalizedUrl)) {
        const allowList = currentSettings.allowList.filter((item) => item !== normalizedUrl);
        yield this.updateFirewall({
          denyList: [...currentSettings.denyList, normalizedUrl],
          allowList
        });
      }
    });
  },
  removeFromDenyList(url) {
    return __async(this, null, function* () {
      const normalizedUrl = normalizeUrl(url);
      const currentSettings = yield this.getFirewall();
      yield this.updateFirewall({
        denyList: currentSettings.denyList.filter((item) => item !== normalizedUrl)
      });
    });
  }
});
//# sourceMappingURL=firewall.js.map
