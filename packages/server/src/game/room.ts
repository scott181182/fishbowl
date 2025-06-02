/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Client } from "@colyseus/core";
import { Room } from "@colyseus/core";

import { FishbowlState } from "./schema/state";



export class FishbowlRoom extends Room {
    state = new FishbowlState();

    private log(message: string) {
        console.log(`[${this.roomName}:${this.roomId}] ${message}`);
    }

    public override onCreate(options: any) {
        this.log(`Creating room with options: ${JSON.stringify(options)}`);
    }
    public override onDispose() {
        this.log("Disposing Room");
    }

    // public static async onAuth(token: string, options: any, context: AuthContext) {
    //     console.log("Authing client:", token, options);
    // }
    public override onJoin(client: Client<any, any>, _options?: any, _auth?: any) {
        this.log(`Client Joined: ${client.sessionId}`);
    }
    public override onLeave(client: Client<any, any>, _consented?: boolean) {
        this.log(`Client Left: ${client.sessionId}`);
    }
}
