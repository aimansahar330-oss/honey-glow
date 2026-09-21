import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient} from "../../generated/prisma/client.ts";

if(!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from .env");

}

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = globalThis.honeyGlowPrisma || new PrismaClient({
    adapter,
});

if(process.env.NODE_ENV !== "production") {
    globalThis.honeyGlowPrisma = prisma;
}

export default prisma;