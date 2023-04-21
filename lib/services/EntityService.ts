import axios from "axios";
import { Entity } from "../models/Entity";

export type IdType = string | string[] | undefined;

export class EntityService {
  static getBaseUrl = (projectId: IdType) => {
    return `/api/project/${projectId}/entity`;
  };

  static create = async (entity: Entity, projectId: IdType) => {
    return await axios.post(EntityService.getBaseUrl(projectId), entity);
  };

  static update = async (entity: Entity, projectId: IdType) => {
    return await axios.put(
      EntityService.getBaseUrl(projectId) + `/${entity.id}`,
      entity
    );
  };

  static delete = async (entityId: string, projectId: IdType) => {
    return await axios.delete(
      EntityService.getBaseUrl(projectId) + `/${entityId}`
    );
  };
}
