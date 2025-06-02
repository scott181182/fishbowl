import path from "node:path";

import { makeSchema } from "nexus";

import * as types from "./schema";



export const schema = makeSchema({
    types,
    contextType: {
        module: path.resolve(__dirname, "context.ts"),
        export: "Context",
    },
    outputs: {
        typegen: {
            outputPath: path.resolve(__dirname, "..", "generated", "nexus.ts"),
        },
        schema: path.resolve(__dirname, "..", "generated", "schema.graphql"),
    }
});
