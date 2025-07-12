/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Client } from "@colyseus/core";
import { Room } from "@colyseus/core";

import { PlayerNotFoundError, TeamNotFoundError } from "./errors";
import type { FishbowlMessageMap } from "./schema/message";
import { FishbowlState, PlayerSchema } from "./schema/state";
import { generateAnimalName } from "./utils/name";



const MESSAGE_HANDLER_MAP: {
    [K in keyof FishbowlMessageMap]: (this: FishbowlRoom, client: Client<any, any>, message: FishbowlMessageMap[K]) => void
} = {
    submitCards(client, _cards: string[]) {
        const player = this.state.players.get(client.sessionId);
        if (!player) { throw new PlayerNotFoundError(client.sessionId); }

        player.state = "ready";
    },
    retractCards(client, _payload: null) {
        const player = this.state.players.get(client.sessionId);
        if (!player) { throw new PlayerNotFoundError(client.sessionId); }

        player.state = "writing";
    },
    joinTeam(client, teamId: string) {
        const player = this.state.players.get(client.sessionId);
        if (!player) { throw new PlayerNotFoundError(client.sessionId); }

        if (!this.state.teams.has(teamId)) { throw new TeamNotFoundError(teamId); }
        player.team = teamId;
    },
    renameTeam(_client, payload) {
        const team = this.state.teams.get(payload.id);
        if (!team) { throw new TeamNotFoundError(payload.id); }

        team.name = payload.newName;
    }
};



export class FishbowlRoom extends Room<FishbowlState> {
    state = new FishbowlState();

    private log(message: string) {
        console.log(`[${this.roomName}:${this.roomId}] ${message}`);
    }

    public override onCreate(options: any) {
        this.log(`Creating room with options: ${JSON.stringify(options)}`);

        for (const messageType in MESSAGE_HANDLER_MAP) {
            this.onMessage(
                messageType,
                MESSAGE_HANDLER_MAP[messageType as keyof FishbowlMessageMap].bind(this) as (client: Client<any, any>, message: FishbowlMessageMap[keyof FishbowlMessageMap]) => void
            );
        }
    }
    public override onDispose() {
        this.log("Disposing Room");
    }

    // public static async onAuth(token: string, options: any, context: AuthContext) {
    //     console.log("Authing client:", token, options);
    // }
    public override onJoin(client: Client<any, any>, _options?: any, _auth?: any) {
        this.log(`Client Joined: ${client.sessionId}`);

        const player = new PlayerSchema({ name: generateAnimalName() });
        this.state.players.set(client.sessionId, player);
    }
    public override onLeave(client: Client<any, any>, _consented?: boolean) {
        this.log(`Client Left: ${client.sessionId}`);

        this.state.players.delete(client.sessionId);
    }
}
