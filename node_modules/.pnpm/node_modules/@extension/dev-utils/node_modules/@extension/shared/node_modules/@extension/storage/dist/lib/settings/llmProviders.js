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
import { llmProviderModelNames, llmProviderParameters, ProviderTypeEnum } from "./types";
const AZURE_API_VERSION = "2025-04-01-preview";
const storage = createStorage(
  "llm-api-keys",
  { providers: {} },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true
  }
);
export function getProviderTypeByProviderId(providerId) {
  if (providerId === ProviderTypeEnum.AzureOpenAI) {
    return ProviderTypeEnum.AzureOpenAI;
  }
  if (typeof providerId === "string" && providerId.startsWith(`${ProviderTypeEnum.AzureOpenAI}_`)) {
    return ProviderTypeEnum.AzureOpenAI;
  }
  switch (providerId) {
    case ProviderTypeEnum.OpenAI:
    case ProviderTypeEnum.Anthropic:
    case ProviderTypeEnum.DeepSeek:
    case ProviderTypeEnum.Gemini:
    case ProviderTypeEnum.Grok:
    case ProviderTypeEnum.Ollama:
    case ProviderTypeEnum.OpenRouter:
    case ProviderTypeEnum.Groq:
    case ProviderTypeEnum.Cerebras:
      return providerId;
    default:
      return ProviderTypeEnum.CustomOpenAI;
  }
}
export function getDefaultDisplayNameFromProviderId(providerId) {
  switch (providerId) {
    case ProviderTypeEnum.OpenAI:
      return "OpenAI";
    case ProviderTypeEnum.Anthropic:
      return "Anthropic";
    case ProviderTypeEnum.DeepSeek:
      return "DeepSeek";
    case ProviderTypeEnum.Gemini:
      return "Gemini";
    case ProviderTypeEnum.Grok:
      return "Grok";
    case ProviderTypeEnum.Ollama:
      return "Ollama";
    case ProviderTypeEnum.AzureOpenAI:
      return "Azure OpenAI";
    case ProviderTypeEnum.OpenRouter:
      return "OpenRouter";
    case ProviderTypeEnum.Groq:
      return "Groq";
    case ProviderTypeEnum.Cerebras:
      return "Cerebras";
    case ProviderTypeEnum.Llama:
      return "Llama";
    default:
      return providerId;
  }
}
export function getDefaultProviderConfig(providerId) {
  switch (providerId) {
    case ProviderTypeEnum.OpenAI:
    case ProviderTypeEnum.Anthropic:
    case ProviderTypeEnum.DeepSeek:
    case ProviderTypeEnum.Gemini:
    case ProviderTypeEnum.Grok:
    case ProviderTypeEnum.OpenRouter:
    // OpenRouter uses modelNames
    case ProviderTypeEnum.Groq:
    // Groq uses modelNames
    case ProviderTypeEnum.Cerebras:
    // Cerebras uses modelNames
    case ProviderTypeEnum.Llama:
      return {
        apiKey: "",
        name: getDefaultDisplayNameFromProviderId(providerId),
        type: providerId,
        baseUrl: providerId === ProviderTypeEnum.OpenRouter ? "https://openrouter.ai/api/v1" : providerId === ProviderTypeEnum.Llama ? "https://api.llama.com/v1" : void 0,
        modelNames: [...llmProviderModelNames[providerId] || []],
        createdAt: Date.now()
      };
    case ProviderTypeEnum.Ollama:
      return {
        apiKey: "ollama",
        // Set default API key for Ollama
        name: getDefaultDisplayNameFromProviderId(ProviderTypeEnum.Ollama),
        type: ProviderTypeEnum.Ollama,
        modelNames: llmProviderModelNames[providerId],
        baseUrl: "http://localhost:11434",
        createdAt: Date.now()
      };
    case ProviderTypeEnum.AzureOpenAI:
      return {
        apiKey: "",
        // User needs to provide API Key
        name: getDefaultDisplayNameFromProviderId(ProviderTypeEnum.AzureOpenAI),
        type: ProviderTypeEnum.AzureOpenAI,
        baseUrl: "",
        // User needs to provide Azure endpoint
        // modelNames: [], // Not used for Azure configuration
        azureDeploymentNames: [],
        // Azure deployment names
        azureApiVersion: AZURE_API_VERSION,
        // Provide a common default API version
        createdAt: Date.now()
      };
    default:
      return {
        apiKey: "",
        name: getDefaultDisplayNameFromProviderId(providerId),
        type: ProviderTypeEnum.CustomOpenAI,
        baseUrl: "",
        modelNames: [],
        // Custom providers use modelNames
        createdAt: Date.now()
      };
  }
}
export function getDefaultAgentModelParams(providerId, agentName) {
  var _a;
  const newParameters = ((_a = llmProviderParameters[providerId]) == null ? void 0 : _a[agentName]) || {
    temperature: 0.1,
    topP: 0.1
  };
  return newParameters;
}
function ensureBackwardCompatibility(providerId, config) {
  const updatedConfig = __spreadValues({}, config);
  if (!updatedConfig.name) {
    updatedConfig.name = getDefaultDisplayNameFromProviderId(providerId);
  }
  if (!updatedConfig.type) {
    updatedConfig.type = getProviderTypeByProviderId(providerId);
  }
  if (updatedConfig.type === ProviderTypeEnum.AzureOpenAI) {
    if (updatedConfig.azureApiVersion === void 0) {
      updatedConfig.azureApiVersion = AZURE_API_VERSION;
    }
    if (!updatedConfig.azureDeploymentNames) {
      updatedConfig.azureDeploymentNames = [];
    }
    if (Object.prototype.hasOwnProperty.call(updatedConfig, "modelNames")) {
      delete updatedConfig.modelNames;
    }
  } else {
    if (!updatedConfig.modelNames) {
      updatedConfig.modelNames = llmProviderModelNames[providerId] || [];
    }
  }
  if (!updatedConfig.createdAt) {
    updatedConfig.createdAt = (/* @__PURE__ */ new Date("03/04/2025")).getTime();
  }
  return updatedConfig;
}
export const llmProviderStore = __spreadProps(__spreadValues({}, storage), {
  setProvider(providerId, config) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d;
      if (!providerId) {
        throw new Error("Provider id cannot be empty");
      }
      if (config.apiKey === void 0) {
        throw new Error("API key must be provided (can be empty for local models)");
      }
      const providerType = config.type || getProviderTypeByProviderId(providerId);
      if (providerType === ProviderTypeEnum.AzureOpenAI) {
        if (!((_a = config.baseUrl) == null ? void 0 : _a.trim())) {
          throw new Error("Azure Endpoint (baseUrl) is required");
        }
        if (!config.azureDeploymentNames || config.azureDeploymentNames.length === 0) {
          throw new Error("At least one Azure Deployment Name is required");
        }
        if (!((_b = config.azureApiVersion) == null ? void 0 : _b.trim())) {
          throw new Error("Azure API Version is required");
        }
        if (!((_c = config.apiKey) == null ? void 0 : _c.trim())) {
          throw new Error("API Key is required for Azure OpenAI");
        }
      } else if (providerType !== ProviderTypeEnum.CustomOpenAI && providerType !== ProviderTypeEnum.Ollama) {
        if (!((_d = config.apiKey) == null ? void 0 : _d.trim())) {
          throw new Error(`API Key is required for ${getDefaultDisplayNameFromProviderId(providerId)}`);
        }
      }
      if (providerType !== ProviderTypeEnum.AzureOpenAI) {
        if (!config.modelNames || config.modelNames.length === 0) {
          console.warn(`Provider ${providerId} of type ${providerType} is being saved without model names.`);
        }
      }
      const completeConfig = __spreadValues({
        apiKey: config.apiKey || "",
        baseUrl: config.baseUrl,
        name: config.name || getDefaultDisplayNameFromProviderId(providerId),
        type: providerType,
        createdAt: config.createdAt || Date.now()
      }, providerType === ProviderTypeEnum.AzureOpenAI ? {
        azureDeploymentNames: config.azureDeploymentNames || [],
        azureApiVersion: config.azureApiVersion
      } : {
        modelNames: config.modelNames || []
      });
      console.log(`[llmProviderStore.setProvider] Saving config for ${providerId}:`, JSON.stringify(completeConfig));
      const current = (yield storage.get()) || { providers: {} };
      yield storage.set({
        providers: __spreadProps(__spreadValues({}, current.providers), {
          [providerId]: completeConfig
        })
      });
    });
  },
  getProvider(providerId) {
    return __async(this, null, function* () {
      const data = (yield storage.get()) || { providers: {} };
      const config = data.providers[providerId];
      return config ? ensureBackwardCompatibility(providerId, config) : void 0;
    });
  },
  removeProvider(providerId) {
    return __async(this, null, function* () {
      const current = (yield storage.get()) || { providers: {} };
      const newProviders = __spreadValues({}, current.providers);
      delete newProviders[providerId];
      yield storage.set({ providers: newProviders });
    });
  },
  hasProvider(providerId) {
    return __async(this, null, function* () {
      const data = (yield storage.get()) || { providers: {} };
      return providerId in data.providers;
    });
  },
  getAllProviders() {
    return __async(this, null, function* () {
      const data = yield storage.get();
      const providers = __spreadValues({}, data.providers);
      for (const [providerId, config] of Object.entries(providers)) {
        providers[providerId] = ensureBackwardCompatibility(providerId, config);
      }
      return providers;
    });
  }
});
//# sourceMappingURL=llmProviders.js.map
