import { ReactElement } from "react";
import Header from "../../components/Layouts/Header";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Member, MemberStatus } from "../../lib/models/Member";
import useSWR from "swr";
import { InvitationService } from "../../lib/services/InvitationService";
import { STATUS_COLORS, TABLE_PROPS } from "../../lib/fixed";
import { useSession } from "next-auth/react";
import TimeAgo from "react-timeago";
import SearchFilter, { useFilters } from "../../components/SearchFilter";
import { useRouter } from "next/router";
import Conditional from "../../components/Conditional";
import { ConfirmPopup } from "primereact/confirmpopup";
import { myConfirmPopUp } from "../../components/MyConfirmPopup";
import { InvitationsUtils } from "../../components/Invitations/InvitationsUtils";
import { ProjectUtils } from "../../components/Projects/ProjectUtils";

function ProjectInvitations() {
  const {
    data: invitations,
    isLoading,
    mutate: refreshInvitations,
  } = useSWR(InvitationService.getBaseUrl());
  const { data: session } = useSession();
  const [filters, setFilters] = useFilters();

  const acceptInvitation = (member: Member) => {
    InvitationsUtils.acceptInvitation({
      member: member,
      onSuccess() {
        if (member.project?.id) {
          ProjectUtils.saveToRecentProjects(member.project.id);
        }
        refreshInvitations();
      },
    });
  };

  const rejectInvitation = (member: Member) => {
    InvitationsUtils.rejectInvitation({
      member: member,
      onSuccess() {
        refreshInvitations();
      },
    });
  };

  const actionBody = (data: Member) => {
    return (
      <Conditional
        if={data.status == MemberStatus.PENDING}
        show={
          <div className="flex gap-2">
            <Button
              className="p-button-text"
              onClick={(event) =>
                myConfirmPopUp({
                  event: event,
                  acceptCallBack: () => acceptInvitation(data),
                })
              }
            >
              Accept
            </Button>
            <Button
              className="p-button-text p-button-danger"
              onClick={(event) =>
                myConfirmPopUp({
                  event: event,
                  acceptCallBack: () => rejectInvitation(data),
                })
              }
            >
              Reject
            </Button>
          </div>
        }
        else={<p>Confirmed</p>}
      />
    );
  };

  const nameBody = (rowData: Member) => {
    return <p className="font-bold">{rowData.project?.name}</p>;
  };

  const statusBody = (rowData: Member) => {
    return (
      <Chip
        label={rowData.status}
        className={STATUS_COLORS[rowData.status!.toLowerCase()]}
      />
    );
  };

  const createdAtBody = (rowData: Member) => {
    return rowData.createdAt && <TimeAgo date={rowData.createdAt} />;
  };

  const invitedByEmailBody = (rowData: Member) => {
    return (
      <Conditional
        if={session?.user?.email === rowData.inviterEmail}
        show={<>System</>}
        else={<>{rowData.inviterEmail}</>}
      />
    );
  };

  const header = (
    <SearchFilter
      title="Invitations"
      subTitle="Your invitations to collaborate"
      filters={filters}
      setFilters={setFilters}
    />
  );

  return (
    <div className="min-h-screen">
      <ConfirmPopup />
      <div className="p-4">
        <DataTable
          loading={isLoading}
          value={invitations?.data}
          filters={filters}
          header={header}
          {...TABLE_PROPS}
        >
          <Column
            field="project.name"
            header="Project name"
            body={nameBody}
          ></Column>
          <Column
            field="inviterEmail"
            header="Invited by"
            body={invitedByEmailBody}
          ></Column>
          <Column
            field="createdAt"
            header="Invited Date"
            body={createdAtBody}
          ></Column>
          <Column field="status" header="Status" body={statusBody}></Column>
          <Column field="role" header="Role"></Column>
          <Column field="action" header="Action" body={actionBody}></Column>
        </DataTable>
      </div>
    </div>
  );
}

ProjectInvitations.getLayout = function PageLayout(page: ReactElement) {
  const router = useRouter();

  return (
    <>
      <Header
        title="Here are your invitations!"
        subTitle="Accept or reject project invitations"
        onTitleClick={() => router.push("/project")}
      />
      {page}
    </>
  );
};

export default ProjectInvitations;
