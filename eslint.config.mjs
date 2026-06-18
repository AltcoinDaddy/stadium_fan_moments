import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

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
