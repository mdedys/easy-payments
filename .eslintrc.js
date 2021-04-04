module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "prettier", "jest"],
  env: {
    browser: true,
    node: true,
    "jest/globals": true,
  },
  rules: {
    "no-console": 1,
    "prettier/prettier": 2,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
  },
};
