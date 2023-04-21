import axios from "axios";
import { Generator } from "../models/Generator";
import { IdType } from "./EntityService";

export class GeneratorService {
  static getBaseUrl = (projectId: IdType) => {
    return `/api/project/${projectId}/generator`;
  };

  static create = async (generator: Generator, projectId: IdType) => {
    return await axios.post(GeneratorService.getBaseUrl(projectId), generator);
  };

  static update = async (generator: Generator, projectId: IdType) => {
    return await axios.put(
      GeneratorService.getBaseUrl(projectId) + `/${generator.id}`,
      generator
    );
  };

  static delete = async (generatorId: string, projectId: IdType) => {
    return await axios.delete(
      GeneratorService.getBaseUrl(projectId) + `/${generatorId}`
    );
  };
}
