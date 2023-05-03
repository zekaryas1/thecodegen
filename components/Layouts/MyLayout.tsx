import { useRouter } from "next/router";
import { ReactNode } from "react";
import { ProjectService } from "../../lib/services/ProjectService";
import Header from "./Header";
import useSWR from "swr";
import { DESTINATIONS } from "../../lib/fixed";

interface Props {
  children: ReactNode;
}

export default function MyLayout({ children }: Props) {
  const router = useRouter();
  const { projectId } = router.query;
  const {
    data: project,
    isLoading,
    error,
  } = useSWR(`${ProjectService.getBaseUrl()}/${projectId}`);

  const paths = router.pathname.split("/");
  const currentPath = DESTINATIONS.fromDashboard.find(
    (it) => it.label === paths[paths.length - 1]
  );

  /**
   * Returns the name and description of a project.
   *
   * @returns {object} An object containing the name and description of the project.
   *                   If an error occurs, the object contains the name "Project Not Found"
   *                   and an empty description.
   *                   If the project is still loading, the object contains the name "Loading..."
   *                   and an empty description.
   */
  const projectName = (): { name: string; description: string } => {
    if (error) {
      return { name: "Project Not Found", description: "" };
    }
    if (isLoading) {
      return { name: "Loading...", description: "" };
    }
    return {
      name: project.data.name,
      description: project.data.description,
    };
  };

  return (
    <div
      className="flex flex-column w-full min-h-screen"
    >
      <Header
        onTitleClick={() => {
          router.push("/project");
        }}
        onDestinationsClick={(destination: string) => {
          router.push(`/project/${projectId}/${destination}`);
        }}
        listOfDestinations={DESTINATIONS.fromDashboard}
        currentDestination={currentPath || DESTINATIONS.fromDashboard[0]}
        title={projectName().name}
        subTitle={projectName().description}
      />
      <div className="flex-grow-1 pl-4 pr-4">{children}</div>
    </div>
  );
}
