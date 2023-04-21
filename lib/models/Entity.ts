import { Column } from "./Column";

export type Entity = Partial<{
  id: string;
  name: string;
  columns: Column[];
}>;

/**
 * Converts an Entity object to a JSON string.
 *
 * @param entity - The Entity object to convert.
 * @returns A formatted JSON string representation of the Entity object.
 */

export const entityToString = (entity: Entity) => {
  return JSON.stringify(
    {
      name: entity.name,
      columns: entity.columns?.map((it) => {
        return {
          name: it.name,
          type: it.type,
          constraint: it.constraint!.map((it) => {
            return {
              name: it.name,
              type: it.type,
              value: it.value,
            };
          }),
        };
      }),
    },
    null,
    4
  );
};
