import { Project } from "../../lib/models/Project";
import Image from "next/image";
import GeoPattern from "geopattern";
import { Divider } from "primereact/divider";
import TimeAgo from "react-timeago";
import { LoadingIndicator } from "../LoadingIndicator";
import Conditional from "../Conditional";

interface CardViewProps {
  projects: Project[] | undefined;
  loggedInUserEmail: string;
  onOpenClicked: (projectId: string) => void;
}

function CardView({
  projects,
  onOpenClicked,
  loggedInUserEmail,
}: CardViewProps) {
  /**
   * Renders a card component for a project.
   * @param {Project} project - The project object to be displayed.
   */
  const card = (project: Project) => {
    const getFromUI = (from: string): JSX.Element => {
      return (
        <h5
          className="absolute"
          style={{ bottom: "20px", left: "10px", zIndex: 30 }}
        >
          from {from}
        </h5>
      );
    };

    if (!project.id) {
      return null;
    }

    return (
      <div
        key={project.id}
        className="surface-card shadow-2 p-1 w-18rem hover:surface-50 cursor-pointer"
        onClick={() => {
          if (project.id) {
            onOpenClicked(project.id);
          }
        }}
      >
        <div className="relative h-10rem">
          <div>
            <h1
              className="absolute w-15rem white-space-nowrap overflow-hidden text-overflow-ellipsis"
              style={{ top: "20px", left: "10px", zIndex: 30 }}
            >
              {project.name}
            </h1>
            <Conditional
              if={project.creatorEmail == loggedInUserEmail}
              show={getFromUI("You")}
              else={getFromUI(project.creatorEmail || "")}
            />
          </div>
          <Image
            src={GeoPattern.generate(project.name).toDataUri()}
            alt={"randomly generated project svg images"}
            fill={true}
            style={{ zIndex: 1 }}
          />
        </div>

        <h5
          title={project.description}
          className="p-2 pt-3 text-gray-400 white-space-nowrap overflow-hidden text-overflow-ellipsis"
        >
          {project.description}
        </h5>
        <Divider className="m-0 mb-2" />
        <h6 className="p-2">
          Created - {project.createdAt && <TimeAgo date={project.createdAt} />}
        </h6>
      </div>
    );
  };

  if (!projects) {
    return (
      <div className="my-4">
        <LoadingIndicator />
      </div>
    );
  }

  if (projects.length === 0) {
    return <h4 className="mt-4"> Projects you open, will show up here. </h4>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 mt-4">
        {projects.map((project: Project) => card(project))}
      </div>
    </>
  );
}

export default CardView;
