import { fileURLToPath } from "node:url";

import { includeIgnoreFile, fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

import svelteConfig from "./svelte.config.js";




const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        },
        rules: {
            // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
            // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
            "no-undef": "off",
        }
    },
    {
        files: [
            "**/*.svelte",
            "**/*.svelte.ts",
            "**/*.svelte.js"
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser,
                svelteConfig
            }
        },
        rules: {
            "svelte/indent": ["error", { indent: 4 }]
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
            // Mark all $-prefixed imports as internal, per SvelteKit's convention.
            // This isn't actually needed in the general case, but because we're symlinking.
            // This plugin is really smart and tries to count the symlink as an external dependency.
            // We don't want that.
            "import/internal-regex": "^\\$"
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
            "$houdini"
        ]
    }
);
