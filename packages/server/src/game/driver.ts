import type { IRoomCache, MatchMakerDriver, RoomCache, SortOptions } from "colyseus";
import { keys } from "remeda";
import { z } from "zod";

import type { GameRoom } from "../generated/prisma";
import { Prisma, PrismaClient } from "../generated/prisma";



const RoomCacheSchema = z.object({
    roomId: z.string(),
    clients: z.number().int().nonnegative(),
    maxClients: z.number().int().nonnegative().nullable(),
    locked: z.boolean(),
    private: z.boolean(),
    name: z.string(),
    processId: z.string(),
    publicAddress: z.string().optional(),
    unlisted: z.boolean(),
    metadata: z.any()
});
const RoomUpdateOperationsSchema = z.object({
    $set: RoomCacheSchema.partial(),
    $inc: z.object({
        clients: z.number().int(),
        maxClients: z.number().int(),
    }).partial()
}).partial().strict();

/**
 * Maps the `any` operations object that Colyseus gives for updates into a Prisma update object.
 * This is supported by {@link RoomUpdateOperationsSchema}, which was derived from the usage of `updateOne` in Colyseus source code.
 */
function mapRoomUpdateOperation(operations: z.infer<typeof RoomUpdateOperationsSchema>): Prisma.GameRoomUpdateInput {
    const data: Prisma.GameRoomUpdateInput = {};
    if (operations.$set) {
        for (const field of keys(operations.$set)) {
            data[field] = operations.$set[field];
        }
    }

    if (operations.$inc) {
        for (const field of keys(operations.$inc)) {
            data[field] = {
                increment: operations.$inc[field]
            };
        }
    }
    return data;
}

/** Takes a {@link GameRoom} record from Prisma and maps it to what Colyseus expects from an {@link IRoomCache} */
function mapDbRoom(room: GameRoom): IRoomCache {
    return {
        ...room,
        maxClients: room.maxClients ?? Infinity,
        publicAddress: room.publicAddress ?? undefined,
    };
}

export class PrismaRoomCache implements RoomCache {
    // Using a JS private field to avoid JSON serialization.
    readonly #db: PrismaClient;

    public roomId: string;
    public clients: number;
    // This is actually nullable.
    public maxClients: number;
    public locked: boolean;
    public private: boolean;
    public name: string;
    public publicAddress?: string;
    public processId: string;
    public unlisted: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public metadata: any;

    public constructor(
        db: PrismaClient,
        data: IRoomCache,
    ) {
        this.#db = db;

        this.roomId = data.roomId;
        this.clients = data.clients;
        this.maxClients = data.maxClients;
        this.locked = data.locked;
        this.private = data.private;
        this.name = data.name;
        this.publicAddress = data.publicAddress;
        this.processId = data.processId;
        this.unlisted = data.unlisted;
        this.metadata = data.metadata;
    }

    public assign(data: Partial<IRoomCache>) {
        Object.assign(this, data);
    }
    public asData(): IRoomCache {
        return {
            roomId: this.roomId,
            clients: this.clients,
            maxClients: this.maxClients ?? Infinity,
            locked: this.locked,
            private: this.private,
            name: this.name,
            publicAddress: this.publicAddress,
            processId: this.processId,
            unlisted: this.unlisted,
            metadata: this.metadata,
        };
    }

    public updateOne(operations: unknown) {
        const ops = RoomUpdateOperationsSchema.parse(operations);
        const data = mapRoomUpdateOperation(ops);
        console.log(`Updating room with '${JSON.stringify(operations)}' -> ${JSON.stringify(data)}`);


        return this.#db.gameRoom.update({
            where: { roomId: this.roomId },
            data
        }).then((res) => {
            this.assign(mapDbRoom(res));
        });
    }

    public async save() {
        console.log(`Saving room: '${JSON.stringify(this.asData())}'`);
        await this.#db.gameRoom.upsert({
            where: { roomId: this.roomId },
            create: this.asData(),
            update: this.asData(),
        });
    }

    public async remove() {
        await this.#db.gameRoom.delete({
            where: { roomId: this.roomId }
        });
    }
}



export class PrismaDriver implements MatchMakerDriver {
    public constructor(
        private readonly db: PrismaClient,
    ) { }

    public createInstance(initialValues: Partial<IRoomCache>): RoomCache {
        console.log(`Creating room '${JSON.stringify(initialValues)}'`);
        // All of these values should be overwritten by Colyseus through the RoomCache.
        // Just have to satisfy types here.
        const data: IRoomCache = {
            roomId: "",
            name: "",
            processId: "",
            clients: 0,
            maxClients: 10,
            locked: false,
            private: false,
            unlisted: false,
            metadata: null,
            ...initialValues
        };

        return new PrismaRoomCache(this.db, data);
    }
    public has(roomId: string): Promise<boolean> {
        console.log(`Checking for room '${roomId}'`);
        return this.db.gameRoom.count({ where: { roomId } }).then((res) => res > 0);
    }
    public query(conditions: Partial<IRoomCache>, sortOptions?: SortOptions): Promise<IRoomCache[]> {
        console.log(`Querying for room '${JSON.stringify(conditions)}'`);
        return this.db.gameRoom.findMany({
            where: conditions,
            orderBy: sortOptions
        }).then((res) => {
            return res.map(mapDbRoom);
        });
    }
    public async cleanup(processId: string): Promise<void> {
        console.log(`Clearing room cache by process ID '${processId}'`);
        await this.db.gameRoom.deleteMany({
            where: { processId }
        });
    }
    public findOne(conditions: Partial<IRoomCache>, sortOptions?: SortOptions): Promise<RoomCache> {
        console.log(`Finding room '${JSON.stringify(conditions)}'`);
        return this.db.gameRoom.findFirst({
            where: conditions,
            orderBy: sortOptions
        }).then((res) => {
            if (!res) { throw new Error(`Could not find room with conditions '${JSON.stringify(conditions)}'`); }
            return new PrismaRoomCache(this.db, mapDbRoom(res));
        });
    }
    public clear(): void {
        console.log("Clearing room cache!");
        this.db.gameRoom.deleteMany();
    }
    public shutdown(): void {
        console.log("Shutting down driver.");
        this.db.$disconnect();
    }
}
