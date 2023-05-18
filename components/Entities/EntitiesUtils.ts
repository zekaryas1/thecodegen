import { Column } from "../../lib/models/Column";
import { Entity } from "../../lib/models/Entity";
import { ColumnService } from "../../lib/services/ColumnService";
import { EntityService } from "../../lib/services/EntityService";

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
    const res = await ColumnService.create(input.data, input.projectId);
    if (res.statusText === "OK") {
      input.onSuccess();
    }
  };
}
