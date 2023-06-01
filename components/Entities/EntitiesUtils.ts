import { MarkerType } from "reactflow";
import { Column } from "../../lib/models/Column";
import { Entity } from "../../lib/models/Entity";
import { ColumnService } from "../../lib/services/ColumnService";
import { EntityService } from "../../lib/services/EntityService";
import { EdgeType, NodeType } from "./Flow";

export class EntitiesUtils {
  static manageEntity = async (input: {
    entity: Entity;
    projectId: string;
    onSuccessfulUpdate: () => void;
    onSuccessfulCreate: (newEntity: Entity) => void;
  }) => {
    if (input.entity.id) {
      const res = await EntityService.update(input.entity, input.projectId);
      if (res.statusText === "OK") {
        input.onSuccessfulUpdate();
      }
    } else {
      const res = await EntityService.create(input.entity, input.projectId);
      if (res.statusText === "OK") {
        input.onSuccessfulCreate(res.data.data);
      }
    }
  };

  static deleteEntity = async (input: {
    id: string;
    projectId: string;
    onSuccess: () => void;
  }) => {
    const res = await EntityService.delete(input.id, input.projectId);
    if (res.statusText === "OK") {
      input.onSuccess();
    }
  };

  static deleteColumn = async (input: {
    columnId: string;
    projectId: string;
    onSuccess: () => void;
  }) => {
    const res = await ColumnService.delete(input.columnId, input.projectId);
    if (res.statusText === "OK") {
      input.onSuccess();
    }
  };

  static addNewColumn = async (input: {
    data: Column;
    projectId: string;
    onSuccess: () => void;
  }) => {
    try {
      const res = await ColumnService.create(input.data, input.projectId);
      if (res.statusText === "OK") {
        input.onSuccess();
      }
    } catch (e) {
      console.log(e);
    }
  };

  static generateNodes = (entities: Entity[]): NodeType[] => {
    return entities?.map((it: Entity) => {
      return {
        id: it.id || "",
        type: "MyCustomSchemaUI",
        position: { x: 0, y: 0 },
        data: it,
      };
    });
  };

  static generateEdges = (entities: Entity[]): EdgeType[] => {
    const getTargetEntityId = (constraintValue: string): string => {
      const [targetEntityName, targetFieldName] = constraintValue.split(".");
      const targetEntity = entities.find(
        (entity) => entity.name === targetEntityName
      );
      return targetEntity?.id ?? targetEntityName;
    };

    const columns = entities?.flatMap((entity) => entity.columns ?? []) || [];
    const edges: EdgeType[] = [];

    for (const column of columns) {
      if (!column.constraint || !column.entityId) continue;
      for (const constraint of column.constraint) {
        if (constraint.type !== "fk") continue;

        edges.push({
          id: constraint.id,
          source: column.entityId,
          target: getTargetEntityId(constraint.value),
          sourceHandle: constraint.name,
          targetHandle: constraint.value,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });
      }
    }

    return edges;
  };

  /**
   * merge new nodes with local nodes and return the result
   * if node is already saved in memory keep the state except for new data
   * @param nodes
   * @param flow
   * @returns synced nodes
   */
  static mergeFlowNodes = (nodes: any[], flow: any) => {
    return nodes.map((node) => {
      const isSaved = flow.nodes.find((it: any) => it.id == node.id);
      if (isSaved) {
        return {
          ...isSaved,
          data: node.data,
        };
      }
      return node;
    });
  };

  /**
   * what happened: an edge has been created between two nodes
   * find the column that needs to be updated and add a new fk constraints to it existing constraints
   * @param edgeData
   * @param entity
   * @returns the updated constraints list
   */
  static getNewColumnForEntity = (edgeData: EdgeType, entity: Entity) => {
    const [_, columnName, __] = edgeData.sourceHandle.split(".");

    const column: Column =
      entity?.columns?.find((col: Column) => col.name === columnName) ||
      <Column>{};

    if (column && column.constraint) {
      column.constraint.push({
        id: "",
        type: "fk",
        name: edgeData.sourceHandle,
        value: edgeData.targetHandle,
        draft: false,
      });
    }
    column.entityId = edgeData.source;
    return column;
  };
}
