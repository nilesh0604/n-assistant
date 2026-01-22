"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const zip_bundle_1 = require("./lib/zip-bundle");
const YYYYMMDD = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const HHmmss = new Date().toISOString().slice(11, 19).replace(/:/g, '');
const fileName = `extension-${YYYYMMDD}-${HHmmss}`;
// package the root dist file
(0, zip_bundle_1.zipBundle)({
    distDirectory: (0, node_path_1.resolve)(__dirname, '../../dist'),
    buildDirectory: (0, node_path_1.resolve)(__dirname, '../../dist-zip'),
    archiveName: process.env.__FIREFOX__ ? `${fileName}.xpi` : `${fileName}.zip`,
});
