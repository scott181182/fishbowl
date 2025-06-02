import type { PrismaClient } from "../generated/prisma";



export interface Context {
    db: PrismaClient;
}
