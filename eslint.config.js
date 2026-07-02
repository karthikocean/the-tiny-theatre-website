// eslint.config.js
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { browser: true, node: true },
    },
    plugins: { react: reactPlugin },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "warn",
    },
    settings: {
      react: { version: "detect" },
    },
  },
];
