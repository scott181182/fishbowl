import { Schema, ArraySchema, type } from "@colyseus/schema";



export type GamePhase = "preparing" | "playing";

export class FishbowlState extends Schema {
    @type(["string"])
    public cards = new ArraySchema<string>();

    @type("string")
    public phase: GamePhase = "preparing";
}
