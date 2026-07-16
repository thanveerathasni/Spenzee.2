import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}