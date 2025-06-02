import { createYoga } from "graphql-yoga";

import type { Context } from "./context";
import { schema } from "./makeSchema";



export function createYogaServer(ctx: Context) {
    const yoga = createYoga({
        schema,
        context: ctx,
        graphqlEndpoint: "/api/graphql",
    });

    return yoga;
}
