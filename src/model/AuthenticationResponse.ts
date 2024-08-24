import { ErrorStatusResponse } from "./ErrorStatusResponse";
import { ResponseStatusEnum } from "./ResponseStatusEnum";

export interface AuthenticationResponse {
    status: ResponseStatusEnum;
    error: ErrorStatusResponse;
    jwtToken: string;
  }