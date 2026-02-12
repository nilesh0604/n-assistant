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
