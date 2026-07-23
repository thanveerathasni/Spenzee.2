import "reflect-metadata";
import { Container } from "inversify";

import { registerBindings } from "./bindings";

export const container = new Container({
  defaultScope: "Singleton",
});


registerBindings(container);
