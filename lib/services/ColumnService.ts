import axios from "axios";
import { Column } from "../models/Column";
import { IdType } from "./EntityService";

export class ColumnService {
  static getBaseUrl = (projectId: IdType) => {
    return `/api/project/${projectId}/column`;
  };

  static create = async (column: Column, projectId: IdType) => {
    return await axios.post(ColumnService.getBaseUrl(projectId), column);
  };

  static update = async (column: Column, projectId: IdType) => {
    return await axios.put(
      ColumnService.getBaseUrl(projectId) + `/${column.id}`,
      column
    );
  };

  static delete = async (columnId: string, projectId: IdType) => {
    return await axios.delete(
      ColumnService.getBaseUrl(projectId) + `/${columnId}`
    );
  };
}
