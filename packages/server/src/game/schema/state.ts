import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";



export type GamePhase = "preparing" | "playing";
export type PlayerState = "writing" | "ready" | "standby" | "guessing" | "serving";

type WithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

export class PlayerSchema extends Schema {
    @type("string")
    public name: string;
    @type("string")
    public team = "team1";

    @type("string")
    public state: PlayerState = "writing";

    @type(["string"])
    public submittedCards = new ArraySchema<string>();

    public constructor(data: WithRequired<PlayerSchema, "name">) {
        super(data);
        this.name = data?.name;
    }
}

export class TeamSchema extends Schema {
    @type("string")
    public name: string;

    @type("uint32")
    public points = 0;

    public constructor(data: WithRequired<TeamSchema, "name">) {
        super(data);
        this.name = data?.name;
    }
}

export class FishbowlState extends Schema {
    @type({ map: PlayerSchema })
    public players = new MapSchema<PlayerSchema>();

    @type({ map: TeamSchema })
    public teams = new MapSchema<TeamSchema>({
        team1: new TeamSchema({ name: "Team 1" }),
        team2: new TeamSchema({ name: "Team 2" }),
    });

    @type("string")
    public phase: GamePhase = "preparing";
    @type("string")
    public activeTeam = "team1";
    @type("string")
    public activeCard = "";

    @type(["string"])
    public cards = new ArraySchema<string>();

    // Constants (for now).
    @type("uint8")
    public cardsPerPerson = 3;
}
