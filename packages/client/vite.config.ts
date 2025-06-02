import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import houdini from "houdini/vite";
import { defineConfig } from "vite";



export default defineConfig({
    plugins: [
        houdini(),
        tailwindcss(),
        sveltekit()
    ],
    server: {
        host: "0.0.0.0",
        proxy: {
            "/api": "http://127.0.0.1:3000",
        },
    },
    test: {
        workspace: [
            {
                extends: "./vite.config.ts",
                plugins: [svelteTesting()],
                test: {
                    name: "client",
                    environment: "jsdom",
                    clearMocks: true,
                    include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
                    exclude: ["src/lib/server/**"],
                    setupFiles: ["./vitest-setup-client.ts"]
                }
            },
            {
                extends: "./vite.config.ts",
                test: {
                    name: "server",
                    environment: "node",
                    include: ["src/**/*.{test,spec}.{js,ts}"],
                    exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"]
                }
            }
        ]
    }
});
