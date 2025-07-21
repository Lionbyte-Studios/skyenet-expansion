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
  },
  {
    files: [
      "core/**/*.{js,mjs,cjs,ts,mts,cts}",
      "server/**/*.{js,mjs,cjs,ts,mts,cts}",
    ],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
]);
