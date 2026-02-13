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
const defaultFavoritePrompts = [
  {
    title: "\u{1F4DA} Explore AI Papers",
    content: "- Go to https://huggingface.co/papers and click through each of the first 3 papers.\n- For each paper:\n  - Record the title, URL and upvotes\n  - Summarise the abstract section\n- Finally, compile together a summary of all 3 papers, ranked by upvotes"
  },
  {
    title: "\u{1F426} Follow us on X/Twitter!",
    content: "Follow us at https://x.com/nilesh0604 to stay updated on the latest news and features!"
  },
  {
    title: "\u{1F31F} Star us on GitHub!",
    content: "Open the N-assistant repository at https://github.com/nilesh0604/local-ai-assistant and check if you've already starred it. If not, please support us by giving us a star!"
  }
];
const initialState = {
  nextId: 1,
  prompts: []
};
const favoritesStorage = createStorage("favorites", initialState, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true
});
export function createFavoritesStorage() {
  return {
    addPrompt: (title, content) => __async(null, null, function* () {
      const { prompts } = yield favoritesStorage.get();
      const existingPrompt = prompts.find((prompt) => prompt.content === content);
      if (existingPrompt) {
        return existingPrompt;
      }
      yield favoritesStorage.set((prev) => {
        const id = prev.nextId;
        const newPrompt = { id, title, content };
        return {
          nextId: id + 1,
          prompts: [newPrompt, ...prev.prompts]
        };
      });
      return (yield favoritesStorage.get()).prompts[0];
    }),
    updatePrompt: (id, title, content) => __async(null, null, function* () {
      let updatedPrompt;
      yield favoritesStorage.set((prev) => {
        const updatedPrompts = prev.prompts.map((prompt) => {
          if (prompt.id === id) {
            updatedPrompt = __spreadProps(__spreadValues({}, prompt), { title, content });
            return updatedPrompt;
          }
          return prompt;
        });
        if (!updatedPrompt) {
          return prev;
        }
        return __spreadProps(__spreadValues({}, prev), {
          prompts: updatedPrompts
        });
      });
      return updatedPrompt;
    }),
    updatePromptTitle: (id, title) => __async(null, null, function* () {
      let updatedPrompt;
      yield favoritesStorage.set((prev) => {
        const updatedPrompts = prev.prompts.map((prompt) => {
          if (prompt.id === id) {
            updatedPrompt = __spreadProps(__spreadValues({}, prompt), { title });
            return updatedPrompt;
          }
          return prompt;
        });
        if (!updatedPrompt) {
          return prev;
        }
        return __spreadProps(__spreadValues({}, prev), {
          prompts: updatedPrompts
        });
      });
      return updatedPrompt;
    }),
    removePrompt: (id) => __async(null, null, function* () {
      yield favoritesStorage.set((prev) => __spreadProps(__spreadValues({}, prev), {
        prompts: prev.prompts.filter((prompt) => prompt.id !== id)
      }));
    }),
    getAllPrompts: () => __async(null, null, function* () {
      const currentState = yield favoritesStorage.get();
      let prompts = currentState.prompts;
      if (currentState.prompts.length === 0 && currentState.nextId === 1) {
        for (const prompt of defaultFavoritePrompts) {
          yield favoritesStorage.set((prev) => {
            const id = prev.nextId;
            const newPrompt = { id, title: prompt.title, content: prompt.content };
            return { nextId: id + 1, prompts: [newPrompt, ...prev.prompts] };
          });
        }
        const newState = yield favoritesStorage.get();
        prompts = newState.prompts;
      }
      return [...prompts].sort((a, b) => b.id - a.id);
    }),
    getPromptById: (id) => __async(null, null, function* () {
      const { prompts } = yield favoritesStorage.get();
      return prompts.find((prompt) => prompt.id === id);
    }),
    reorderPrompts: (draggedId, targetId) => __async(null, null, function* () {
      yield favoritesStorage.set((prev) => {
        const promptsCopy = [...prev.prompts];
        const sourceIndex = promptsCopy.findIndex((prompt) => prompt.id === draggedId);
        const targetIndex = promptsCopy.findIndex((prompt) => prompt.id === targetId);
        if (sourceIndex === -1 || targetIndex === -1) {
          return prev;
        }
        const [movedItem] = promptsCopy.splice(sourceIndex, 1);
        promptsCopy.splice(targetIndex, 0, movedItem);
        const numPrompts = promptsCopy.length;
        const updatedPromptsWithNewIds = promptsCopy.map((prompt, index) => __spreadProps(__spreadValues({}, prompt), {
          id: numPrompts - index
          // Assigns IDs: numPrompts, numPrompts-1, ..., 1
        }));
        return __spreadProps(__spreadValues({}, prev), {
          prompts: updatedPromptsWithNewIds,
          nextId: numPrompts + 1
          // Update nextId accordingly
        });
      });
    })
  };
}
export default createFavoritesStorage();
//# sourceMappingURL=favorites.js.map
