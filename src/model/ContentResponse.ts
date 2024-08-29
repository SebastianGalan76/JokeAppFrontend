import { ErrorStatusResponse } from "./ErrorStatusResponse";
import { ResponseStatusEnum } from "./ResponseStatusEnum";

export interface ContentResponse<T> {
    status: ResponseStatusEnum;
    error: ErrorStatusResponse;
    content: T
}