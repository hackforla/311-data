// Copies all required duckdb artificts from node_modules to the current directory
// This will make them available to the browser since the following webpack.config.js rule
// exists and will pick them up to be processed by the worker-loader package:

/*
test: /\.worker\.(js|cjs|mjs)$/,
        use: { loader: "worker-loader" },
*/

// Usage:
//        node ./bundle.mjs

// Source: https://github.com/duckdb/duckdb-wasm/blob/master/examples/bare-browser/bundle.mjs
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const DUCKDB_DIST = path.dirname(require.resolve('@duckdb/duckdb-wasm'));

function printErr(err) {
  // eslint-disable-next-line no-console
  return !!err === true ? console.log(err) : null;
}

fs.copyFile(path.resolve(DUCKDB_DIST, 'duckdb-browser.mjs'), './duckdb-browser.mjs', printErr);
fs.copyFile(path.resolve(DUCKDB_DIST, 'duckdb-mvp.wasm'), './duckdb-mvp.wasm', printErr);
fs.copyFile(path.resolve(DUCKDB_DIST, 'duckdb-eh.wasm'), './duckdb-eh.wasm', printErr);
fs.copyFile(path.resolve(DUCKDB_DIST, 'duckdb-browser-mvp.worker.js'), './duckdb-browser-mvp.worker.js', printErr);
fs.copyFile(path.resolve(DUCKDB_DIST, 'duckdb-browser-eh.worker.js'), './duckdb-browser-eh.worker.js', printErr);
