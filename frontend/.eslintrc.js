/* eslint-env node */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended', // integrates Prettier
  ],
  plugins: ['react'],
  rules: {
    // your overrides, e.g.:
    'react/prop-types': 'off',
    // 'no-console': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
