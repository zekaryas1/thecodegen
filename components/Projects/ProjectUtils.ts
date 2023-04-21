import { error } from "console";
import { ProjectService } from "../../lib/services/ProjectService";

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
}
