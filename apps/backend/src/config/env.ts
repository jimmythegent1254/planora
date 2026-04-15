import path from "node:path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
};
