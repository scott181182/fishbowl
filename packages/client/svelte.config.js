import path from "node:path";

import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "svelte-adapter-bun";


/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
        alias: {
            $houdini: path.resolve(".", "$houdini")
        },
        typescript: {
            config(config) {
                config.compilerOptions.rootDirs.push("../$houdini/types");
                return config;
            }
        }
    },
    extensions: [".svelte"],
};

export default config;
