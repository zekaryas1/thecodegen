import axios from "axios";
import { Template } from "../models/Template";
import { IdType } from "./EntityService";

export class TemplateService {
  static getBaseUrl = (projectId: IdType) => {
    return `/api/project/${projectId}/template`;
  };

  static update = async (template: Template, projectId: IdType) => {
    return await axios.put(
      TemplateService.getBaseUrl(projectId) + `/${template.id}`,
      template
    );
  };
}
