import "dotenv/config";

import {
  PrismaClient,
} from "@prisma/client";

import {
  PrismaPg,
} from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing from environment variables"
  );
}

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL,
});

const prisma =
  globalThis.honeyGlowPrisma ||
  new PrismaClient({
    adapter,
  });

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalThis.honeyGlowPrisma =
    prisma;
}

export default prisma;