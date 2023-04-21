export type Column = Partial<{
  id: string;
  name: string;
  type: string;
  entityId: string;
  constraint: ConstraintType[];
  [key: string]: any;
}>;

export type ConstraintType = {
  id: string;
  name: string;
  type: string;
  value: string;
  draft: boolean;
  [key: string]: any;
};
