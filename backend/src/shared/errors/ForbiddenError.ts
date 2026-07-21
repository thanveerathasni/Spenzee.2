import { HTTP_STATUS } from "../constants";
import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}