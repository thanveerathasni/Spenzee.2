import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}