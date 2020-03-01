module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    "import/extensions": [
      ".js",
      ".jsx"
    ],
    'import/resolver': {
      webpack: "webpack.config.js",
    },
  },
  plugins: [
    'react',
    'react-hooks'
  ],
  rules: {
    'linebreak-style': 'off',
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "arrow-parens": ["error", "as-needed"]
  },
};
