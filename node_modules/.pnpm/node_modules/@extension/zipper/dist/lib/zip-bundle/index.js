"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipBundle = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const fast_glob_1 = __importDefault(require("fast-glob"));
const fflate_1 = require("fflate");
// Converts bytes to megabytes
function toMB(bytes) {
    return bytes / 1024 / 1024;
}
// Creates the build directory if it doesn't exist
function ensureBuildDirectoryExists(buildDirectory) {
    if (!(0, node_fs_1.existsSync)(buildDirectory)) {
        (0, node_fs_1.mkdirSync)(buildDirectory, { recursive: true });
    }
}
// Logs the package size and duration
function logPackageSize(size, startTime) {
    console.log(`Zip Package size: ${toMB(size).toFixed(2)} MB in ${Date.now() - startTime}ms`);
}
// Handles file streaming and zipping
function streamFileToZip(absPath, relPath, zip, onAbort, onError) {
    const data = new fflate_1.AsyncZipDeflate(relPath, { level: 9 });
    zip.add(data);
    (0, node_fs_1.createReadStream)(absPath)
        .on('data', (chunk) => {
        // If the chunk is a string, convert it to a Buffer
        const bufferChunk = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
        data.push(bufferChunk, false);
    })
        .on('end', () => data.push(new Uint8Array(0), true))
        .on('error', error => {
        onAbort();
        onError(error);
    });
}
// Zips the bundle
const zipBundle = (_a, ...args_1) => __awaiter(void 0, [_a, ...args_1], void 0, function* ({ distDirectory, buildDirectory, archiveName, }, withMaps = false) {
    ensureBuildDirectoryExists(buildDirectory);
    const zipFilePath = (0, node_path_1.resolve)(buildDirectory, archiveName);
    const output = (0, node_fs_1.createWriteStream)(zipFilePath);
    const fileList = yield (0, fast_glob_1.default)([
        '**/*', // Pick all nested files
        ...(!withMaps ? ['!**/(*.js.map|*.css.map)'] : []), // Exclude source maps conditionally
    ], {
        cwd: distDirectory,
        onlyFiles: true,
    });
    return new Promise((pResolve, pReject) => {
        let aborted = false;
        let totalSize = 0;
        const timer = Date.now();
        const zip = new fflate_1.Zip((err, data, final) => {
            if (err) {
                pReject(err);
            }
            else {
                totalSize += data.length;
                output.write(data);
                if (final) {
                    logPackageSize(totalSize, timer);
                    output.end();
                    pResolve();
                }
            }
        });
        // Handle file read streams
        for (const file of fileList) {
            if (aborted)
                return;
            const absPath = (0, node_path_1.resolve)(distDirectory, file);
            const absPosixPath = node_path_1.posix.resolve(distDirectory, file);
            const relPosixPath = node_path_1.posix.relative(distDirectory, absPosixPath);
            console.log(`Adding file: ${relPosixPath}`);
            streamFileToZip(absPath, relPosixPath, zip, () => {
                aborted = true;
                zip.terminate();
            }, error => pReject(`Error reading file ${absPath}: ${error.message}`));
        }
        zip.end();
    });
});
exports.zipBundle = zipBundle;
