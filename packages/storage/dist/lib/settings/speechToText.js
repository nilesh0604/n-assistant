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
const storage = createStorage(
  "speech-to-text-model",
  { speechToTextModel: void 0 },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true
  }
);
function validateSpeechToTextModelConfig(config) {
  if (!config.provider || !config.modelName) {
    throw new Error("Provider and model name must be specified for speech-to-text");
  }
}
export const speechToTextModelStore = __spreadProps(__spreadValues({}, storage), {
  setSpeechToTextModel: (config) => __async(null, null, function* () {
    validateSpeechToTextModelConfig(config);
    yield storage.set({ speechToTextModel: config });
  }),
  getSpeechToTextModel: () => __async(null, null, function* () {
    const data = yield storage.get();
    return data.speechToTextModel;
  }),
  resetSpeechToTextModel: () => __async(null, null, function* () {
    yield storage.set({ speechToTextModel: void 0 });
  }),
  hasSpeechToTextModel: () => __async(null, null, function* () {
    const data = yield storage.get();
    return data.speechToTextModel !== void 0;
  })
});
//# sourceMappingURL=speechToText.js.map
