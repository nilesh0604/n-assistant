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
import { createStorage } from "../base/base";
import { StorageEnum } from "../base/enums";
const CHAT_SESSIONS_META_KEY = "chat_sessions_meta";
const chatSessionsMetaStorage = createStorage(CHAT_SESSIONS_META_KEY, [], {
  storageEnum: StorageEnum.Local,
  liveUpdate: true
});
const getSessionMessagesKey = (sessionId) => `chat_messages_${sessionId}`;
const getSessionMessagesStorage = (sessionId) => {
  return createStorage(getSessionMessagesKey(sessionId), [], {
    storageEnum: StorageEnum.Local,
    liveUpdate: true
  });
};
const getSessionAgentStepHistoryKey = (sessionId) => `chat_agent_step_${sessionId}`;
const getSessionAgentStepHistoryStorage = (sessionId) => {
  return createStorage(
    getSessionAgentStepHistoryKey(sessionId),
    {
      task: "",
      history: "",
      timestamp: 0
    },
    {
      storageEnum: StorageEnum.Local,
      liveUpdate: true
    }
  );
};
const getCurrentTimestamp = () => Date.now();
export function createChatHistoryStorage() {
  return {
    getAllSessions: () => __async(null, null, function* () {
      const sessionsMeta = yield chatSessionsMetaStorage.get();
      return sessionsMeta.map((meta) => __spreadProps(__spreadValues({}, meta), {
        messages: []
        // Empty array as we don't load messages for listing
      }));
    }),
    clearAllSessions: () => __async(null, null, function* () {
      const sessionsMeta = yield chatSessionsMetaStorage.get();
      for (const sessionMeta of sessionsMeta) {
        const messagesStorage = getSessionMessagesStorage(sessionMeta.id);
        yield messagesStorage.set([]);
      }
      yield chatSessionsMetaStorage.set([]);
    }),
    // Get session metadata without messages (for UI listing)
    getSessionsMetadata: () => __async(null, null, function* () {
      return yield chatSessionsMetaStorage.get();
    }),
    getSession: (sessionId) => __async(null, null, function* () {
      const sessionsMeta = yield chatSessionsMetaStorage.get();
      const sessionMeta = sessionsMeta.find((session) => session.id === sessionId);
      if (!sessionMeta) return null;
      const messagesStorage = getSessionMessagesStorage(sessionId);
      const messages = yield messagesStorage.get();
      return __spreadProps(__spreadValues({}, sessionMeta), {
        messages
      });
    }),
    createSession: (title) => __async(null, null, function* () {
      const newSessionId = crypto.randomUUID();
      const currentTime = getCurrentTimestamp();
      const newSessionMeta = {
        id: newSessionId,
        title,
        createdAt: currentTime,
        updatedAt: currentTime,
        messageCount: 0
      };
      const messagesStorage = getSessionMessagesStorage(newSessionId);
      yield messagesStorage.set([]);
      yield chatSessionsMetaStorage.set((prevSessions) => [...prevSessions, newSessionMeta]);
      return __spreadProps(__spreadValues({}, newSessionMeta), {
        messages: []
      });
    }),
    updateTitle: (sessionId, title) => __async(null, null, function* () {
      let updatedSessionMeta;
      yield chatSessionsMetaStorage.set((prevSessions) => {
        return prevSessions.map((session) => {
          if (session.id === sessionId) {
            const updated = __spreadProps(__spreadValues({}, session), {
              title,
              updatedAt: getCurrentTimestamp()
            });
            updatedSessionMeta = updated;
            return updated;
          }
          return session;
        });
      });
      if (!updatedSessionMeta) {
        throw new Error("Session not found");
      }
      return updatedSessionMeta;
    }),
    deleteSession: (sessionId) => __async(null, null, function* () {
      yield chatSessionsMetaStorage.set((prevSessions) => prevSessions.filter((session) => session.id !== sessionId));
      const messagesStorage = getSessionMessagesStorage(sessionId);
      yield messagesStorage.set([]);
    }),
    addMessage: (sessionId, message) => __async(null, null, function* () {
      const newMessage = __spreadProps(__spreadValues({}, message), {
        id: crypto.randomUUID()
      });
      let sessionFound = false;
      yield chatSessionsMetaStorage.set((prevSessions) => {
        return prevSessions.map((session) => {
          if (session.id === sessionId) {
            sessionFound = true;
            return __spreadProps(__spreadValues({}, session), {
              updatedAt: getCurrentTimestamp(),
              messageCount: session.messageCount + 1
            });
          }
          return session;
        });
      });
      if (!sessionFound) {
        throw new Error(`Session with ID ${sessionId} not found`);
      }
      const messagesStorage = getSessionMessagesStorage(sessionId);
      yield messagesStorage.set((prevMessages) => [...prevMessages, newMessage]);
      return newMessage;
    }),
    deleteMessage: (sessionId, messageId) => __async(null, null, function* () {
      const messagesStorage = getSessionMessagesStorage(sessionId);
      const currentMessages = yield messagesStorage.get();
      const messageToDelete = currentMessages.find((msg) => msg.id === messageId);
      if (!messageToDelete) return;
      yield messagesStorage.set((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      yield chatSessionsMetaStorage.set((prevSessions) => {
        return prevSessions.map((session) => {
          if (session.id === sessionId) {
            return __spreadProps(__spreadValues({}, session), {
              updatedAt: getCurrentTimestamp(),
              messageCount: Math.max(0, session.messageCount - 1)
            });
          }
          return session;
        });
      });
    }),
    storeAgentStepHistory: (sessionId, task, history) => __async(null, null, function* () {
      const sessionsMeta = yield chatSessionsMetaStorage.get();
      const sessionMeta = sessionsMeta.find((session) => session.id === sessionId);
      if (!sessionMeta) {
        throw new Error(`Session with ID ${sessionId} not found`);
      }
      const agentStepHistoryStorage = getSessionAgentStepHistoryStorage(sessionId);
      yield agentStepHistoryStorage.set({
        task,
        history,
        timestamp: getCurrentTimestamp()
      });
    }),
    loadAgentStepHistory: (sessionId) => __async(null, null, function* () {
      const agentStepHistoryStorage = getSessionAgentStepHistoryStorage(sessionId);
      const history = yield agentStepHistoryStorage.get();
      if (!history || !history.task || !history.timestamp || history.history === "" || history.history === "[]")
        return null;
      return history;
    })
  };
}
export const chatHistoryStore = createChatHistoryStorage();
//# sourceMappingURL=history.js.map
