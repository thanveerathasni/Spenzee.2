import { WinstonLogger } from "../../shared/logger/WinstonLogger";
import { TYPES } from "../types";

import type { ILogger } from "../../shared/logger/ILogger";
import type { Container } from "inversify";



export function registerLoggerBindings(container: Container): void {
  container.bind<ILogger>(TYPES.Logger).to(WinstonLogger).inSingletonScope();
}
