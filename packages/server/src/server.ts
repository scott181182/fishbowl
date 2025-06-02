import { createServer as createNodeServer } from "node:http";

import { WebSocketTransport } from "@colyseus/ws-transport";
import { Server } from "colyseus";
import express from "express";
import helmet from "helmet";

import { PrismaDriver } from "./game/driver";
import { FishbowlRoom } from "./game/room";
import { PrismaClient } from "./generated/prisma";
import { createYogaServer } from "./graphql";



export async function createServer() {
    const app = express();
    app.use(helmet());

    const db = new PrismaClient();
    await db.$connect();
    console.log("Connected to database!");

    const yoga = createYogaServer({
        db
    });
    app.use(yoga.graphqlEndpoint, yoga);

    app.get("/api/status", (_req, res) => {
        res.json({ status: "ok" });
    });

    const server = createNodeServer(app);
    const gameServer = new Server({
        transport: new WebSocketTransport({
            server,
        }),
        driver: new PrismaDriver(db),
        greet: false,
    });

    gameServer.define("fishbowl", FishbowlRoom);

    return gameServer;
}
