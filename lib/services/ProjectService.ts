import { Project } from "../models/Project";
import axios from "axios";

export class ProjectService {
  static getBaseUrl = () => {
    return `/api/project`;
  };

  static getProject = async (projectId: string) => {
    return await axios.get(`${ProjectService.getBaseUrl()}/${projectId}`);
  }

  static create = async (project: Project) => {
    return await axios.post(ProjectService.getBaseUrl(), project);
  };

  static update = async (project: Project) => {
    return await axios.put(
      ProjectService.getBaseUrl() + `/${project.id}`,
      project
    );
  };

  static delete = async (projectId: string) => {
    return await axios.delete(ProjectService.getBaseUrl() + `/${projectId}`);
  };
}
