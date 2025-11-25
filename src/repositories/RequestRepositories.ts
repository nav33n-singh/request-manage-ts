import { Database } from "../databases";
import { CommonPaginationRequest } from "../types/common/request";
import { StatusCodes, StatusMessages } from "../types/common/status-codes";
import { RequestRow } from "../types/dtos/requests";
import { AppError } from "../utils/app-error";
import { CreateRequestQueryParams, PaginationQueryResult, UpdateRequestQueryParams } from "./interfaces";

export class RequestRepository {
  private pg = Database.getInstance().pgClient;

  async createRequest(queryParams: CreateRequestQueryParams): Promise<RequestRow> {
    const queryResult = await this.pg('requests').insert(queryParams).returning('*');
    return queryResult[0];
  }

  async getRequestById(requestId: number): Promise<RequestRow> {
    const query = this.pg("requests");
    query.where("RequestID", requestId);
    query.first();

    const queryResult = await query;
    if (!queryResult) {
      throw new AppError(StatusMessages.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return queryResult as unknown as RequestRow;
  }

  async updateStatus(requestId: number, updates: UpdateRequestQueryParams): Promise<RequestRow> {
    const query = this.pg("requests");
    query.where("RequestID", requestId);
    query.update(updates)
    query.returning('*');

    const queryResult = await query;
    return queryResult[0];
  }

  async getRequestsByRequestor(requestorId: number, pagination: CommonPaginationRequest): Promise<PaginationQueryResult<RequestRow[]>> {
    const { page, count } = pagination
    const query = this.pg("requests");
    query.where("RequestorID", requestorId);
    query.orderBy("CreatedAt", "desc");
    query.limit(count)
    query.offset((page - 1) * count);

    const countQuery = this.pg("requests");
    countQuery.where("RequestorID", requestorId);
    countQuery.count({ count: '*' })

    const [rows, total] = await Promise.all([query, countQuery]);
    const result: PaginationQueryResult<RequestRow[]> = {
      rows: rows,
      count: total[0]?.count ? parseInt(String(total[0].count)) : 0
    }
    return result;
  }

  async getQueuedRequestsForManager(managerId: number, pagination: CommonPaginationRequest): Promise<PaginationQueryResult<RequestRow[]>> {
    const { page, count } = pagination
    const query = this.pg("requests");
    query.where("ApproverID", managerId);
    query.orderBy("CreatedAt", "desc");
    query.limit(count)
    query.offset((page - 1) * count);

    const countQuery = this.pg("requests");
    countQuery.where("ApproverID", managerId);
    countQuery.count({ count: '*' })

    const [rows, total] = await Promise.all([query, countQuery]);
    const result: PaginationQueryResult<RequestRow[]> = {
      rows: rows,
      count: total[0]?.count ? parseInt(String(total[0].count)) : 0
    }
    return result;
  }

  async getQueuedRequestsForAssignee(AssigneeId: number, pagination: CommonPaginationRequest): Promise<PaginationQueryResult<RequestRow[]>> {
    const { page, count } = pagination
    const query = this.pg("requests");
    query.where("AssigneeID", AssigneeId);
    query.orderBy("CreatedAt", "desc");
    query.limit(count)
    query.offset((page - 1) * count);

    const countQuery = this.pg("requests");
    countQuery.where("AssigneeID", AssigneeId);
    countQuery.count({ count: '*' })

    const [rows, total] = await Promise.all([query, countQuery]);
    const result: PaginationQueryResult<RequestRow[]> = {
      rows: rows,
      count: total[0]?.count ? parseInt(String(total[0].count)) : 0
    }
    return result;
  }
}
