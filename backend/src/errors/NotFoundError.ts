import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}