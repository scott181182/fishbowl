import { fileURLToPath } from "node:url";

import { includeIgnoreFile, fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import ts from "typescript-eslint";



const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        languageOptions: {
            globals: { ...globals.node }
        },
        rules: {
            // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
            // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
            "no-undef": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
        }
    },
    {
        plugins: {
            import: fixupPluginRules(importPlugin),
        },
        settings: {
            "import/resolver": {
                typescript: true,
                node: true,
            },
        },
        rules: {
            // Import Rules
            "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
            "import/first": ["error"],
            "import/newline-after-import": ["warn", { count: 3 }],
            "import/no-absolute-path": ["error"],
            "import/no-useless-path-segments": ["error"],
            "import/order": ["error", {
                "groups": [
                    "builtin",
                    "external",
                ],
                "newlines-between": "always",
                "alphabetize": {
                    order: "asc",
                    orderImportKind: "asc",
                    caseInsensitive: true,
                },
            }],
        },
    },
    {
        plugins: { "@stylistic": stylistic },
        rules: {
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": ["error", "always"]
        }
    },
    {
        ignores: [
            "src/generated/**/*"
        ]
    }
);
