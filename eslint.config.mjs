import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["client/**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "(.*?)",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "(.*?)",
        },
      ],
    },
  },
  {
    files: [
      "core/**/*.{js,mjs,cjs,ts,mts,cts}",
      "server/**/*.{js,mjs,cjs,ts,mts,cts}",
    ],
    languageOptions: { globals: globals.node },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "(.*?)",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "(.*?)",
        },
      ],
    },
  },
  tseslint.configs.recommended,
]);
