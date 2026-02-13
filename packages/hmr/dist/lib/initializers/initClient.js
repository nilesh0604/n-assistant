"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initClient;
const constant_1 = require("../constant");
const interpreter_1 = __importDefault(require("../interpreter"));
function initClient({ id, onUpdate }) {
    const ws = new WebSocket(constant_1.LOCAL_RELOAD_SOCKET_URL);
    ws.onopen = () => {
        ws.addEventListener('message', event => {
            const message = interpreter_1.default.receive(String(event.data));
            if (message.type === constant_1.DO_UPDATE && message.id === id) {
                onUpdate();
                ws.send(interpreter_1.default.send({ type: constant_1.DONE_UPDATE }));
                return;
            }
        });
    };
}
