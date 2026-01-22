"use strict";
export var AgentNameEnum = /* @__PURE__ */ ((AgentNameEnum2) => {
  AgentNameEnum2["Planner"] = "planner";
  AgentNameEnum2["Navigator"] = "navigator";
  return AgentNameEnum2;
})(AgentNameEnum || {});
export var ProviderTypeEnum = /* @__PURE__ */ ((ProviderTypeEnum2) => {
  ProviderTypeEnum2["OpenAI"] = "openai";
  ProviderTypeEnum2["Anthropic"] = "anthropic";
  ProviderTypeEnum2["DeepSeek"] = "deepseek";
  ProviderTypeEnum2["Gemini"] = "gemini";
  ProviderTypeEnum2["Grok"] = "grok";
  ProviderTypeEnum2["Ollama"] = "ollama";
  ProviderTypeEnum2["AzureOpenAI"] = "azure_openai";
  ProviderTypeEnum2["OpenRouter"] = "openrouter";
  ProviderTypeEnum2["Groq"] = "groq";
  ProviderTypeEnum2["Cerebras"] = "cerebras";
  ProviderTypeEnum2["Llama"] = "llama";
  ProviderTypeEnum2["CustomOpenAI"] = "custom_openai";
  return ProviderTypeEnum2;
})(ProviderTypeEnum || {});
export const llmProviderModelNames = {
  ["openai" /* OpenAI */]: [
    "gpt-5.1",
    "gpt-5",
    "gpt-5-pro",
    "gpt-5-mini",
    "gpt-5-chat-latest",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4o"
  ],
  ["anthropic" /* Anthropic */]: ["claude-sonnet-4-5", "claude-haiku-4-5", "claude-opus-4-1"],
  ["deepseek" /* DeepSeek */]: ["deepseek-chat", "deepseek-reasoner"],
  ["gemini" /* Gemini */]: ["gemini-3-pro-preview", "gemini-2.5-flash", "gemini-2.5-pro"],
  ["grok" /* Grok */]: ["grok-4", "grok-4-fast-non-reasoning", "grok-3", "grok-3-fast"],
  ["ollama" /* Ollama */]: ["qwen3:14b", "falcon3:10b", "qwen2.5-coder:14b", "mistral-small:24b"],
  ["azure_openai" /* AzureOpenAI */]: ["gpt-5", "gpt-5-mini", "gpt-4.1", "gpt-4.1-mini", "gpt-4o"],
  ["openrouter" /* OpenRouter */]: ["google/gemini-2.5-pro", "google/gemini-2.5-flash", "openai/gpt-4o-2024-11-20"],
  ["groq" /* Groq */]: ["llama-3.3-70b-versatile"],
  ["cerebras" /* Cerebras */]: ["llama-3.3-70b"],
  ["llama" /* Llama */]: [
    "Llama-3.3-70B-Instruct",
    "Llama-3.3-8B-Instruct",
    "Llama-4-Maverick-17B-128E-Instruct-FP8",
    "Llama-4-Scout-17B-16E-Instruct-FP8"
  ]
  // Custom OpenAI providers don't have predefined models as they are user-defined
};
export const llmProviderParameters = {
  ["openai" /* OpenAI */]: {
    ["planner" /* Planner */]: {
      temperature: 0.7,
      topP: 0.9
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.3,
      topP: 0.85
    }
  },
  ["anthropic" /* Anthropic */]: {
    ["planner" /* Planner */]: {
      temperature: 0.3,
      topP: 0.6
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.2,
      topP: 0.5
    }
  },
  ["gemini" /* Gemini */]: {
    ["planner" /* Planner */]: {
      temperature: 0.7,
      topP: 0.9
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.3,
      topP: 0.85
    }
  },
  ["grok" /* Grok */]: {
    ["planner" /* Planner */]: {
      temperature: 0.7,
      topP: 0.9
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.3,
      topP: 0.85
    }
  },
  ["ollama" /* Ollama */]: {
    ["planner" /* Planner */]: {
      temperature: 0.3,
      topP: 0.9
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.1,
      topP: 0.85
    }
  },
  ["azure_openai" /* AzureOpenAI */]: {
    ["planner" /* Planner */]: {
      temperature: 0.7,
      topP: 0.9
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.3,
      topP: 0.85
    }
  },
  ["openrouter" /* OpenRouter */]: {
    ["planner" /* Planner */]: {
      temperature: 0.7,
      topP: 0.9
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.3,
      topP: 0.85
    }
  },
  ["groq" /* Groq */]: {
    ["planner" /* Planner */]: {
      temperature: 0.7,
      topP: 0.9
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.3,
      topP: 0.85
    }
  },
  ["cerebras" /* Cerebras */]: {
    ["planner" /* Planner */]: {
      temperature: 0.7,
      topP: 0.9
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.3,
      topP: 0.85
    }
  },
  ["llama" /* Llama */]: {
    ["planner" /* Planner */]: {
      temperature: 0.7,
      topP: 0.9
    },
    ["navigator" /* Navigator */]: {
      temperature: 0.3,
      topP: 0.85
    }
  }
};
//# sourceMappingURL=types.js.map
