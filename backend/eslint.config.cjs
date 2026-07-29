const tseslint = require("@typescript-eslint/eslint-plugin");
const parser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");

module.exports = [
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },

  {
    files: ["src/**/*.ts"],

    languageOptions: {
      parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
    },

    rules: {
      "no-console": "error",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",

      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      "@typescript-eslint/no-floating-promises": "error",

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],

      "@typescript-eslint/no-unnecessary-type-assertion": "error",

      "@typescript-eslint/no-inferrable-types": "off",

      "@typescript-eslint/await-thenable": "error",

      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": "allow-with-description",
          minimumDescriptionLength: 5,
        },
      ],

      "@typescript-eslint/prefer-nullish-coalescing": "error",

      "@typescript-eslint/prefer-optional-chain": "error",

      "@typescript-eslint/no-empty-function": "error",
    },
  },

  prettier,
];
