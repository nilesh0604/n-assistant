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
import { AgentNameEnum, llmProviderParameters } from "./types";
const storage = createStorage(
  "agent-models",
  { agents: {} },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true
  }
);
function validateModelConfig(config) {
  if (!config.provider || !config.modelName) {
    throw new Error("Provider and model name must be specified");
  }
}
function getModelParameters(agent, provider) {
  var _a;
  const providerParams = (_a = llmProviderParameters[provider]) == null ? void 0 : _a[agent];
  return providerParams != null ? providerParams : { temperature: 0.1, topP: 0.1 };
}
export const agentModelStore = __spreadProps(__spreadValues({}, storage), {
  setAgentModel: (agent, config) => __async(null, null, function* () {
    validateModelConfig(config);
    const defaultParams = getModelParameters(agent, config.provider);
    const mergedConfig = __spreadProps(__spreadValues({}, config), {
      parameters: __spreadValues(__spreadValues({}, defaultParams), config.parameters)
    });
    yield storage.set((current) => ({
      agents: __spreadProps(__spreadValues({}, current.agents), {
        [agent]: mergedConfig
      })
    }));
  }),
  getAgentModel: (agent) => __async(null, null, function* () {
    const data = yield storage.get();
    const config = data.agents[agent];
    if (!config) return void 0;
    const defaultParams = getModelParameters(agent, config.provider);
    return __spreadProps(__spreadValues({}, config), {
      parameters: __spreadValues(__spreadValues({}, defaultParams), config.parameters)
    });
  }),
  resetAgentModel: (agent) => __async(null, null, function* () {
    yield storage.set((current) => {
      const newAgents = __spreadValues({}, current.agents);
      delete newAgents[agent];
      return { agents: newAgents };
    });
  }),
  hasAgentModel: (agent) => __async(null, null, function* () {
    const data = yield storage.get();
    return agent in data.agents;
  }),
  getConfiguredAgents: () => __async(null, null, function* () {
    const data = yield storage.get();
    return Object.keys(data.agents).filter(
      (agentKey) => agentKey !== "validator" && Object.values(AgentNameEnum).includes(agentKey)
    );
  }),
  getAllAgentModels: () => __async(null, null, function* () {
    const data = yield storage.get();
    const filteredAgents = {};
    for (const [agentKey, config] of Object.entries(data.agents)) {
      if (agentKey !== "validator" && Object.values(AgentNameEnum).includes(agentKey)) {
        filteredAgents[agentKey] = config;
      }
    }
    return filteredAgents;
  }),
  cleanupLegacyValidatorSettings: () => __async(null, null, function* () {
    yield storage.set((current) => {
      const newAgents = __spreadValues({}, current.agents);
      delete newAgents["validator"];
      return { agents: newAgents };
    });
  })
});
//# sourceMappingURL=agentModels.js.map
