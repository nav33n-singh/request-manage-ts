import { Database } from "../databases";
import { RequestAuditRow } from "../types/dtos/request-audit";
import { CreateAuditQueryParams } from "./interfaces";

export class RequestAuditRepository {
  private pg = Database.getInstance().pgClient;

  async createAudit(queryParams: CreateAuditQueryParams): Promise<RequestAuditRow> {
      const queryResult = await this.pg('request_audit').insert(queryParams).returning('*');
      return queryResult[0];
    }
}
