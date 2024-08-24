import { ErrorStatusResponse } from "./ErrorStatusResponse";
import { ResponseStatusEnum } from "./ResponseStatusEnum";

export interface Response {
    status: ResponseStatusEnum;
    error: ErrorStatusResponse;
}