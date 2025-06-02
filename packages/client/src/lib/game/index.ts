import { Client as GameClient } from "colyseus.js";

import { FishbowlState } from "./schema";



const client = new GameClient("ws://localhost:3000/api/game");

export function joinGameRoom(roomId: string) {
    return client.joinById(roomId, undefined, FishbowlState);
}
