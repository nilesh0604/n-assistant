"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const constant_1 = require("../constant");
const interpreter_1 = __importDefault(require("../interpreter"));
const clientsThatNeedToUpdate = new Set();
function initReloadServer() {
    const wss = new ws_1.WebSocketServer({ port: constant_1.LOCAL_RELOAD_SOCKET_PORT });
    wss.on('listening', () => {
        console.log(`[HMR] Server listening at ${constant_1.LOCAL_RELOAD_SOCKET_URL}`);
    });
    wss.on('connection', ws => {
        clientsThatNeedToUpdate.add(ws);
        ws.addEventListener('close', () => {
            clientsThatNeedToUpdate.delete(ws);
        });
        ws.addEventListener('message', event => {
            if (typeof event.data !== 'string')
                return;
            const message = interpreter_1.default.receive(event.data);
            if (message.type === constant_1.DONE_UPDATE) {
                ws.close();
            }
            if (message.type === constant_1.BUILD_COMPLETE) {
                clientsThatNeedToUpdate.forEach((ws) => ws.send(interpreter_1.default.send({ type: constant_1.DO_UPDATE, id: message.id })));
            }
        });
    });
    wss.on('error', error => {
        console.error(`[HMR] Failed to start server at ${constant_1.LOCAL_RELOAD_SOCKET_URL}`);
        throw error;
    });
}
initReloadServer();
