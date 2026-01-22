"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchRebuildPlugin = watchRebuildPlugin;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const ws_1 = require("ws");
const interpreter_1 = __importDefault(require("../interpreter"));
const constant_1 = require("../constant");
const injectionsPath = node_path_1.default.resolve(__dirname, '..', '..', '..', 'build', 'injections');
const refreshCode = node_fs_1.default.readFileSync(node_path_1.default.resolve(injectionsPath, 'refresh.js'), 'utf-8');
const reloadCode = node_fs_1.default.readFileSync(node_path_1.default.resolve(injectionsPath, 'reload.js'), 'utf-8');
function watchRebuildPlugin(config) {
    const { refresh, reload, id: _id, onStart } = config;
    const hmrCode = (refresh ? refreshCode : '') + (reload ? reloadCode : '');
    let ws = null;
    const id = _id !== null && _id !== void 0 ? _id : Math.random().toString(36);
    let reconnectTries = 0;
    function initializeWebSocket() {
        ws = new ws_1.WebSocket(constant_1.LOCAL_RELOAD_SOCKET_URL);
        ws.onopen = () => {
            console.log(`[HMR] Connected to dev-server at ${constant_1.LOCAL_RELOAD_SOCKET_URL}`);
        };
        ws.onerror = () => {
            console.error(`[HMR] Failed to connect server at ${constant_1.LOCAL_RELOAD_SOCKET_URL}`);
            console.warn('Retrying in 3 seconds...');
            ws = null;
            if (reconnectTries <= 2) {
                setTimeout(() => {
                    reconnectTries++;
                    initializeWebSocket();
                }, 3000);
            }
            else {
                console.error(`[HMR] Cannot establish connection to server at ${constant_1.LOCAL_RELOAD_SOCKET_URL}`);
            }
        };
    }
    const banner = `(function(){let __HMR_ID="${id}";\n${hmrCode}\n})();`;
    return {
        name: 'watch-rebuild',
        /**
         * Use Rollup's banner option to inject HMR code before sourcemap generation.
         * This ensures that sourcemaps remain accurate by accounting for the injected lines.
         *
         * Previously, code was injected in generateBundle() after sourcemap creation,
         * causing line number mismatches in dev tools.
         */
        outputOptions(outputOptions) {
            const existingBanner = outputOptions.banner;
            if (typeof existingBanner === 'string') {
                outputOptions.banner = existingBanner + '\n' + banner;
            }
            else if (typeof existingBanner === 'function') {
                outputOptions.banner = (...args) => {
                    const result = existingBanner(...args);
                    return (result || '') + '\n' + banner;
                };
            }
            else {
                outputOptions.banner = banner;
            }
            return outputOptions;
        },
        writeBundle() {
            onStart === null || onStart === void 0 ? void 0 : onStart();
            if (!ws) {
                initializeWebSocket();
                return;
            }
            /**
             * When the build is complete, send a message to the reload server.
             * The reload server will send a message to the client to reload or refresh the extension.
             */
            ws.send(interpreter_1.default.send({ type: constant_1.BUILD_COMPLETE, id }));
        },
    };
}
