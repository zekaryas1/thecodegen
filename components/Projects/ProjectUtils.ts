import { error } from "console";
import { ProjectService } from "../../lib/services/ProjectService";
import { Project } from "../../lib/models/Project";

/**
 * Utility functions for projects
 */
export class ProjectUtils {
  /**
   * Loads recent projects from local storage and fetches their data from the server.
   * Then updates the state with the fetched projects.
   */
  static loadRecentProjects = async () => {
    const prevItems: string[] = JSON.parse(
      localStorage.getItem("recentProjects") || "[]"
    );

    const output = [];
    for (let projectIds of prevItems) {
      let isError = false;
      const res = await ProjectService.getProject(projectIds)
        .then((res) => res.data)
        .catch((error) => {
          isError = true;
          console.log(error);
        });
      if (!isError && res.data) {
        output.push(res.data);
      }
    }

    return output;
  };

  /**
   * Saves recent projects to local storage.
   * Then updates the state with the fetched projects.
   * @param projects
   * @returns {Promise<void>}
   * */
  static saveToRecentProjects = (projectId: string) => {
    const prevItems: string[] = JSON.parse(
      localStorage.getItem("recentProjects") || "[]"
    );
    if (prevItems.includes(projectId)) {
      prevItems.splice(prevItems.indexOf(projectId), 1);
    }
    prevItems.unshift(projectId);
    if (prevItems.length > 7) {
      prevItems.pop();
    }
    localStorage.setItem("recentProjects", JSON.stringify(prevItems));
  };

  /**
   * Manages a project. If the project is new, it creates a new project. If the project is existing, it updates the project.
   * @param {Project} project - The project object to be displayed.
   */
  static manageProject = async (input: {
    project: Project;
    onSuccessfulUpdate: (response: Project) => void;
    onSuccessfulCreation: (response: Project) => void;
  }) => {
    if (input.project.id) {
      const response = await ProjectService.update(input.project);
      if (response.statusText === "OK") {
        input.onSuccessfulUpdate(response.data);
      }
    } else {
      const response = await ProjectService.create(input.project);
      if (response.statusText === "OK") {
        input.onSuccessfulCreation(response.data);
      }
    }
  };

  static deleteProject = async (input: {
    id: string;
    onSuccess: () => void;
  }) => {
    const response = await ProjectService.delete(input.id);
    if (response.statusText === "OK") {
      input.onSuccess();
    }
  };
}
