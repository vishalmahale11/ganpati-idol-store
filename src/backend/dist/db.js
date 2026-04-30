import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Always load `src/api/.env` whether you run from `src/`, `dist/`, or any cwd
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Create src/api/.env (see .env.example) with DATABASE_URL=...");
}
const adapter = new PrismaPg({
    connectionString,
    /** Fail fast instead of hanging requests when Postgres is unreachable. */
    connectionTimeoutMillis: 10_000,
});
export const prisma = new PrismaClient({ adapter });
