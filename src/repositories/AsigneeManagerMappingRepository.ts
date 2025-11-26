import { Database } from "../databases";
import { StatusCodes } from "../types/common/status-codes";
import { AppError } from "../utils/app-error";

export class AsigneeManagerMappingRepository {
  private pg = Database.getInstance().pgClient;

  async getManagerForAssignee(assigneeId: number): Promise<number> {
    const query = this.pg("assignee_manager_mappings");
    query.where("AssigneeID", assigneeId);
    query.where("IsActive", true);
    query.first("ManagerID");

    const queryResult: any = await query;
    if (!queryResult) {
      throw new AppError("No manager configured for assignee", StatusCodes.BAD_REQUEST);
    }
    return parseInt(queryResult.ManagerID);
  }

  async getAllActiveAssignees(): Promise<number[]> {
    const query = this.pg("assignee_manager_mappings");
    query.where("IsActive", true);
    query.select("AssigneeID");
    query.distinct("AssigneeID");

    const queryResult: any[] = await query;
    return queryResult.map(row => parseInt(row.AssigneeID));
  }
}
