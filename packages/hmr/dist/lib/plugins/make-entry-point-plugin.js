"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEntryPointPlugin = makeEntryPointPlugin;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * make entry point file for content script cache busting
 */
function makeEntryPointPlugin() {
    const cleanupTargets = new Set();
    const isFirefox = process.env.__FIREFOX__ === 'true';
    return {
        name: 'make-entry-point-plugin',
        generateBundle(options, bundle) {
            const outputDir = options.dir;
            if (!outputDir) {
                throw new Error('Output directory not found');
            }
            for (const module of Object.values(bundle)) {
                const fileName = node_path_1.default.basename(module.fileName);
                const newFileName = fileName.replace('.js', '_dev.js');
                switch (module.type) {
                    case 'asset':
                        if (fileName.endsWith('.map')) {
                            cleanupTargets.add(node_path_1.default.resolve(outputDir, fileName));
                            const originalFileName = fileName.replace('.map', '');
                            const replacedSource = String(module.source).replaceAll(originalFileName, newFileName);
                            module.source = '';
                            node_fs_1.default.writeFileSync(node_path_1.default.resolve(outputDir, newFileName), replacedSource);
                            break;
                        }
                        break;
                    case 'chunk': {
                        node_fs_1.default.writeFileSync(node_path_1.default.resolve(outputDir, newFileName), module.code);
                        if (isFirefox) {
                            const contentDirectory = extractContentDir(outputDir);
                            module.code = `import(browser.runtime.getURL("${contentDirectory}/${newFileName}"));`;
                        }
                        else {
                            module.code = `import('./${newFileName}');`;
                        }
                        break;
                    }
                }
            }
        },
        closeBundle() {
            cleanupTargets.forEach(target => {
                node_fs_1.default.unlinkSync(target);
            });
        },
    };
}
/**
 * Extract content directory from output directory for Firefox
 * @param outputDir
 */
function extractContentDir(outputDir) {
    const parts = outputDir.split(node_path_1.default.sep);
    const distIndex = parts.indexOf('dist');
    if (distIndex !== -1 && distIndex < parts.length - 1) {
        return parts.slice(distIndex + 1);
    }
    throw new Error('Output directory does not contain "dist"');
}
