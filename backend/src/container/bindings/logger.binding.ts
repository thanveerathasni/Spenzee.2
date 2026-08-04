import type { Container } from "inversify";

import { TYPES } from "../types";

import { ConsoleLogger } from "../../shared/logger/ConsoleLogger";
import type { ILogger } from "../../shared/logger/ILogger";
import {WinstonLogger} from "../../shared/logger/WinstonLogger"
export function registerLoggerBindings(container: Container): void {
    container
        .bind<ILogger>(TYPES.Logger)
        .to(WinstonLogger)
        .inSingletonScope();
}