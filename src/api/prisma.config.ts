import "dotenv/config";
import { defineConfig } from "prisma/config";

/** Fallback only for `prisma generate` when `.env` is missing; migrations/runtime use real `DATABASE_URL`. */
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://prisma:prisma@127.0.0.1:5432/prisma?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
