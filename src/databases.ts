import knex, { Knex } from "knex";
import { POSTGRES_CONFIG } from "./config";

export class Database {
  private static _instance: Database;
  private constructor() { };
  public pgClient!: Knex;
  public static getInstance(): Database {
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  public async initPostgres(): Promise<Knex> {
    if (!this.pgClient) {
      this.pgClient = knex(POSTGRES_CONFIG);
    }
    return this.pgClient;
  }
}