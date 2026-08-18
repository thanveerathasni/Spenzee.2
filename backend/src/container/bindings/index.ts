import { registerAdminBindings } from "./admin.binding";
import { registerAuthBindings } from "./auth.binding";
import { registerLoggerBindings } from "./logger.binding";
import { registerUserBindings } from "./user.binding";

import type { Container } from "inversify";


export function registerBindings(container: Container): void {
  registerLoggerBindings(container);
  registerUserBindings(container);
  registerAuthBindings(container);
  registerAdminBindings(container);
}
