import "reflect-metadata";

import { Container } from "inversify";

import { registerBindings } from "./bindings/index";

export const container = new Container({
  defaultScope: "Singleton",
});

registerBindings(container);