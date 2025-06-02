import { matchMaker } from "colyseus";
import { mutationField, objectType } from "nexus";





export const GameRoom = objectType({
    name: "GameRoom",
    definition(t) {
        t.nonNull.id("roomId");
        t.nonNull.string("name");

        t.nonNull.int("clients");
        t.int("maxClients");
        t.string("publicAddress");
        t.nonNull.string("processId");
        t.nonNull.boolean("locked");
        t.nonNull.boolean("private");
        t.nonNull.boolean("unlisted");
        t.json("metadata");
    },
});

export const CreateGameRoom = mutationField((t) => {
    t.nonNull.field("createGameRoom", {
        type: GameRoom,
        async resolve() {
            return matchMaker.createRoom("fishbowl", {});
        }
    });
});
