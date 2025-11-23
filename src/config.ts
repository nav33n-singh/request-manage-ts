import { Knex } from "knex";

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const JWT_EXPIRY = 30 /*minutes*/ * 60 /*seconds*/;

export const PORT = parseInt(process.env.JWT_SECRET as string) || 4001;

export const POSTGRES_CONFIG: Knex.Config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  }
};