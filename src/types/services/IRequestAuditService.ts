import { ResponseBoolean } from "../common/response";
import { CreateRequestAuditCommand } from "../states/request-audit";

export interface IRequestService {
  createRequestAudit(command: CreateRequestAuditCommand): Promise<ResponseBoolean>
}