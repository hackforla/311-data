/* eslint-disable no-console */

// Checks to see if .env has all keys in .example.env. Any missing keys will be copied.
// If no .env file is found, one is created from .example.env.

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const red = '\x1b[31m%s\x1b[0m';
const green = '\x1b[32m%s\x1b[0m';

const envPath = path.resolve(__dirname, '../.env');
const exampleEnvPath = path.resolve(__dirname, '../.example.env');

function getEnv(fileName) {
  return dotenv.parse(fs.readFileSync(fileName));
}

(function checkEnv() {
  console.log('Checking .env file...');

  if (fs.existsSync(envPath)) {
    const env = getEnv(envPath);
    const exampleEnv = getEnv(exampleEnvPath);
    const missingKeys = Object.keys(exampleEnv).filter(key => !Object.keys(env).includes(key));

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
