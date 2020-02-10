const fs = require('fs');
const dotenv = require('dotenv');
const actual = dotenv.parse(fs.readFileSync('.env'));
const expected = dotenv.parse(fs.readFileSync('.example.env'));

Object.keys(expected).forEach((key) => {
  if (!actual.hasOwnProperty(key)) {
    exit(1);
  }
  console.log(`System environment variable of ${key} exists: ${actual.hasOwnProperty(key)}`);
});
