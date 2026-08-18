import type { Container } from "inversify";

import { registerLoggerBindings } from "./logger.binding";
import { registerUserBindings } from "./user.binding";
import { registerAuthBindings } from "./auth.binding";
import { registerAdminBindings } from "./admin.binding";

export function registerBindings(container: Container): void {
  registerLoggerBindings(container);
  registerUserBindings(container);
  registerAuthBindings(container);
  registerAdminBindings(container);
}