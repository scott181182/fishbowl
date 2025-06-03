import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";



export type GamePhase = "preparing" | "playing";
export type PlayerState = "writing" | "ready" | "standby" | "guessing" | "serving";

export class PlayerSchema extends Schema {
    @type("string")
    public name: string;
    @type("string")
    public team = "team1";

    @type("string")
    public state: PlayerState = "writing";

    @type(["string"])
    public submittedCards = new ArraySchema<string>();

    public constructor(name: string) {
        super();
        this.name = name;
    }
}

export class TeamSchema extends Schema {
    @type("string")
    public name: string;

    @type("uint32")
    public points = 0;

    public constructor(name: string) {
        super();
        this.name = name;
    }
}

export class FishbowlState extends Schema {
    @type({ map: PlayerSchema })
    public players = new MapSchema<PlayerSchema>();
    @type("string")
    public phase: GamePhase = "preparing";

    @type({ map: TeamSchema })
    public teams = new MapSchema<TeamSchema>({
        team1: new TeamSchema("Team 1"),
        team2: new TeamSchema("Team 2"),
    });
    @type(["string"])
    public cards = new ArraySchema<string>();

    @type("string")
    public activeTeam = "team1";
    @type("string")
    public activeCard = "";

    // Constants (for now).
    @type("uint8")
    public cardsPerPerson = 3;
}
