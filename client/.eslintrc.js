module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["airbnb", "eslint:recommended", "plugin:react/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  settings: {
    "import/extensions": [".js", ".jsx"],
    "import/resolver": {
      node: {},
      webpack: "webpack.config.js",
    },
  },
  plugins: ["react", "react-hooks"],
  rules: {
    "linebreak-style": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "arrow-parens": ["error", "as-needed"],
    indent: [
      "error",
      2,
      {
        SwitchCase: 1,
        MemberExpression: "off",
        ignoredNodes: ["TemplateLiteral"],
      },
    ],
    "template-curly-spacing": "off",
    "jsx-a11y/no-noninteractive-tabindex": [
      "error",
      {
        tags: [],
        roles: ["tabpanel"],
      },
    ],
    "jsx-a11y/label-has-associated-control": [ 2, {
      "labelComponents": ["label"],
      "labelAttributes": ["htmlFor"],
      "controlComponents": ["input"]
    }],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
  },
};
