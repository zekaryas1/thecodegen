import { Generator } from "./Generator";

export type Template = Partial<{
  id: string;
  body: string;
  generator: Generator;
}>;
