import type { Room } from "colyseus.js";
import { createSubscriber } from "svelte/reactivity";

import type { FishbowlState } from "./schema";
import type { FishbowlMessageMap } from "./schema/message";



export class GameInstance {
    #state: FishbowlState;
    readonly #subscribe: () => void;

    public get state() {
        this.#subscribe();
        return this.#state;
    }

    public get sessionId() { return this.room.sessionId; }
    public get currentPlayer() { return this.state.players.get(this.room.sessionId); }

    public constructor(
        private readonly room: Room<FishbowlState>
    ) {
        this.#state = room.state;
        this.#subscribe = createSubscriber((update) => {
            const ee = room.onStateChange((state) => {
                console.log("Update!");
                this.#state = state;
                update();
            });

            return () => { ee.clear(); };
        });
    }

    public send<K extends keyof FishbowlMessageMap>(type: K, payload: FishbowlMessageMap[K]) {
        this.room.send(type, payload);
    }

    public disconnect() {
        this.room?.leave();
    }
}
