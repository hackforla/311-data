/* eslint-disable no-console */

// Checks to see if .env has all keys in .example.env. Any missing keys will be copied.
// If no .env file is found, one is created from .example.env.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const red = '\x1b[31m%s\x1b[0m';
const green = '\x1b[32m%s\x1b[0m';
const vitePrefix = 'VITE_';

const envPath = path.resolve(__dirname, '../../.env');
const exampleEnvPath = path.resolve(__dirname, '../../.example.env');

function getEnv(fileName) {
  return dotenv.parse(fs.readFileSync(fileName));
}

(function checkEnv() {
  console.log('Checking .env file...');

  if (fs.existsSync(envPath)) {
    const env = getEnv(envPath);
    const exampleEnv = getEnv(exampleEnvPath);
    const envKeys = Object.keys(env);
    let missingKeys = Object.keys(exampleEnv).filter(key => !envKeys.includes(key));
    const keysToRenameForVite = envKeys.filter(key =>
      missingKeys.some(missingKey => missingKey === vitePrefix + key)
    );

    // for variables that client-side code needs to access, ensure their names begin with `VITE_`
    // https://vitejs.dev/guide/env-and-mode.html#env-files
    if (keysToRenameForVite.length > 0) {
      console.log('These keys in your .env file are not compatible with Vite:', keysToRenameForVite, '\n');
      console.log('Renaming incompatible keys...');
      let envText = fs.readFileSync(envPath, 'utf8');
      keysToRenameForVite.forEach(key => envText = envText.replace(key, vitePrefix + key));
      fs.writeFileSync(envPath, envText)
      console.log(green, `File updated: ${envPath}\n`);
    }

    missingKeys = missingKeys.filter(key =>
      !keysToRenameForVite
        .map(missingViteKey => vitePrefix + missingViteKey)
        .includes(key)
    );

    if (missingKeys.length > 0) {
      console.log('You are missing these keys in your .env file:', missingKeys, '\n');
      console.log('Copying missing keys to .env...');
      missingKeys.forEach(key => fs.appendFileSync(envPath, `\n${key}=${exampleEnv[key]}`));
      console.log(green, `File updated: ${envPath}\nDon't forget to update the values!`);
    } else {
      console.log(green, 'Your .env file has all required keys.');
    }
  } else {
    console.error(red, `No .env file found in ${__dirname}`);
    console.log('Creating .env file from .example.env...');
    fs.copyFileSync(exampleEnvPath, envPath);
    console.log(green, `File created: ${envPath}\nDon't forget to update the values!`);
  }
}());
