import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...tseslint.configs.recommended,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "lib/**",
    "broadcast/**",
    "cache/**",
    "next-env.d.ts",
    ".output/**",
  ]),

  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/components",
              from: "./src/screens",
              message:
                "Components cannot import from screens. Keep them generic.",
            },
            {
              target: "./src/components/ui",
              from: "./src/components",
              message:
                "UI components cannot import from other component groups.",
            },
          ],
        },
      ],

      "max-lines": [
        "warn",
        { max: 500, skipBlankLines: true, skipComments: true },
      ],
      "max-lines-per-function": [
        "warn",
        { max: 100, skipBlankLines: true, skipComments: true },
      ],

      complexity: ["warn", { max: 25 }],
      "max-depth": ["warn", { max: 4 }],
      "max-params": ["warn", { max: 4 }],

      "import/no-cycle": "error",
    },
  },
]);

export default eslintConfig;
