import Header from "../../components/Layouts/Header";
import { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";
import { Button } from "primereact/button";
import useSWR from "swr";
import { Project } from "../../lib/models/Project";
import { ProjectService } from "../../lib/services/ProjectService";
import ManageProjectDialog from "../../components/Projects/ManageProjectDialog";
import { signOut, useSession } from "next-auth/react";
import TableView from "../../components/Projects/TableView";
import CardView from "../../components/Projects/CardView";
import { useRouter } from "next/router";
import { ProjectUtils } from "../../components/Projects/ProjectUtils";
import Conditional from "../../components/Conditional";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DESTINATIONS } from "../../lib/fixed";

const Projects: NextPageWithLayout = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project>({});
  const {
    data: projects,
    isLoading,
    mutate: refreshProjects,
  } = useSWR(ProjectService.getBaseUrl());
  const { data: session } = useSession();
  const router = useRouter();

  const [showRecent, setShowRecent] = useState(true);
  const [recentProjects, setRecentProjects] = useState<Project[]>();

  useEffect(() => {
    const recentProjects = async () => {
      const output = await ProjectUtils.loadRecentProjects();
      setRecentProjects(output);
    };
    recentProjects();
  }, []);

  /**
   * Manages a project. If the project is new, it creates a new project. If the project is existing, it updates the project.
   * @param {Project} project - The project object to be displayed.
   */
  const manageProject = async (project: Project) => {
    if (project.id) {
      await ProjectService.update(project).then((res) => res.data);
      refreshProjects();
    } else {
      const response = await ProjectService.create(project).then(
        (res) => res.data
      );
      refreshProjects({ ...projects, response });
    }
  };

  const deleteProject = async (id: string) => {
    await ProjectService.delete(id);
    refreshProjects({ ...projects.data.filter((it: Project) => it.id !== id) });
  };

  const onDialogClose = () => {
    setSelectedProject({});
    setShowDialog(false);
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setShowDialog(true);
  };
  const goToProjects = (projectId: string) => {
    ProjectUtils.saveToRecentProjects(projectId);
    router.push(`/project/${projectId}/entities`);
  };

  return (
    <>
      <div className="p-4 h-screen">
        <div className="flex justify-content-between">
          <span className="p-buttonset">
            <Button
              label="Recent"
              className={showRecent ? "" : "text-gray-300 surface-50"}
              icon="pi pi-clock"
              onClick={() => setShowRecent(!showRecent)}
            />
            <Button
              label="All projects"
              className={showRecent ? "text-gray-300 surface-50" : ""}
              icon="pi pi-table"
              onClick={() => setShowRecent(!showRecent)}
            />
          </span>
          <Button
            label="Create new project"
            className="p-button-sm"
            onClick={() => setShowDialog(true)}
          />
        </div>

        <Conditional
          if={showRecent}
          show={
            <CardView
              projects={recentProjects}
              loggedInUserEmail={session?.user?.email || ""}
              onOpenClicked={goToProjects}
            />
          }
          else={
            <div className="mt-4 mr-3">
              <TableView
                isLoading={isLoading}
                loggedInUserEmail={session?.user?.email || ""}
                onOpenClicked={goToProjects}
                onEditClicked={openEditDialog}
                projects={projects?.data || []}
              />
            </div>
          }
        />
      </div>
      {showDialog && (
        <ManageProjectDialog
          data={selectedProject}
          onDelete={deleteProject}
          onClose={onDialogClose}
          onSubmit={manageProject}
          show={showDialog}
        />
      )}
    </>
  );
};

Projects.getLayout = function PageLayout(page: ReactElement) {
  const router = useRouter();

  const confirm1 = () => {
    const accept = () => {
      signOut();
    };

    const reject = () => {};

    confirmDialog({
      message: "Are you sure you want to logout?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept,
      reject,
    });
  };

  return (
    <>
      <ConfirmDialog />
      <Header
        title="What are you working on today?"
        subTitle="Select or create a project to get started"
        listOfDestinations={DESTINATIONS.fromPrject}
        onDestionationsClick={(destination) => {
          if (destination === "Logout") {
            confirm1();
          } else {
            router.push("/project/invitations");
          }
        }}
      />
      {page}
    </>
  );
};

export default Projects;
