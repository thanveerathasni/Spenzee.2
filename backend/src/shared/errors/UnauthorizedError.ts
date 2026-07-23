import { HTTP_STATUS } from "../constants";
import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}