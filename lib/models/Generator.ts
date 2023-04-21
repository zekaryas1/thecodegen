import { Template } from "./Template";

export type Generator = Partial<{
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  template: Template;
}>;
