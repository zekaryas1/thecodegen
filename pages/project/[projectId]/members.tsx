import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { MemberService } from "../../../lib/services/MemberService";
import { useSession } from "next-auth/react";
import SearchFilter, { useFilters } from "../../../components/SearchFilter";
import { Member } from "../../../lib/models/Member";
import { Button } from "primereact/button";
import AdminOrOwner from "../../../components/AdminOrOwner";
import { Chip } from "primereact/chip";
import { STATUS_COLORS, TABLE_PROPS } from "../../../lib/fixed";
import TimeAgo from "react-timeago";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ManageMemberDialog from "../../../components/Members/ManageMemberDialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import Conditional from "../../../components/Conditional";
import { MembersUtils } from "../../../components/Members/MembersUtils";
import { myConfirmPopUp } from "../../../components/MyConfirmPopup";
import ToggleRole from "../../../components/Members/ToggleUserRole";
import { UserRole } from "../../../lib/models/User";

function Members() {
  const router = useRouter();
  const { projectId } = router.query;
  const [show, setShow] = useState(false);
  const {
    data: members,
    isLoading,
    mutate: refreshMembers,
  } = useSWR(MemberService.getBaseUrl(projectId));
  const { data: session } = useSession();
  const [filters, setFilters] = useFilters();

  const inviteNewMember = (email: string) => {
    MembersUtils.inviteNewMember({
      newMembersEmail: email,
      projectId: projectId as string,
      onSuccess(response) {
        refreshMembers({ ...members, response });
      },
    });
  };

  const deleteMember = (data: Member, event: any) => {
    myConfirmPopUp({
      event: event,
      acceptCallBack: () =>
        data.id &&
        MembersUtils.deleteMember({
          memberId: data.id,
          projectId: projectId as string,
          onSuccess() {
            refreshMembers();
          },
        }),
    });
  };

  /**
   * Returns a JSX element that conditionally renders a ToggleRole component if
   * the data.role prop is truthy.
   *
   * @returns {JSX.Element} The JSX element to render.
   */
  const toggleRoleOptions = (input: {
    projectId: string;
    data: Member;
    onSuccess: () => void;
  }) => {
    const onChangeRoleClicked = (role: UserRole) => {
      MembersUtils.updateRoleTo({
        projectId: input.projectId,
        role: role,
        data: input.data,
        onSuccess: input.onSuccess,
      });
    };

    return (
      <Conditional
        if={input.data.role}
        show={
          <AdminOrOwner>
            <ToggleRole
              oldRole={input.data.role!}
              onClick={onChangeRoleClicked}
            />
          </AdminOrOwner>
        }
      />
    );
  };

  const actionBody = (data: Member) => {
    const removeButton = (label: string) => {
      return (
        <Button
          label={label}
          className="p-button-sm p-button-danger p-button-text"
          onClick={(event) => deleteMember(data, event)}
        />
      );
    };

    return (
      <>
        <div className="flex">
          {MembersUtils.removeMemberButton({
            data: data,
            currentLoggedInUserEmail: session?.user?.email as string,
            leaveProjectButton(): JSX.Element {
              return removeButton("Leave project");
            },
            removeUserButton(): JSX.Element {
              return <AdminOrOwner>{removeButton("Remove user")}</AdminOrOwner>;
            },
          })}
          {toggleRoleOptions({
            projectId: projectId as string,
            data: data,
            onSuccess() {
              refreshMembers();
            },
          })}
        </div>
      </>
    );
  };

  const statusBody = (rowData: any) => {
    return (
      <Chip
        label={rowData.status}
        className={STATUS_COLORS[rowData.status.toLowerCase()]}
      />
    );
  };

  const emailBody = (rowData: Member) => {
    return (
      <Conditional
        if={session?.user?.email === rowData.inviteeEmail}
        show={<>You</>}
        else={<>{rowData.inviteeEmail}</>}
      />
    );
  };

  const createdAtBody = (rowData: Member) => {
    return (
      <Conditional
        if={rowData.createdAt}
        //@ts-ignore
        show={<TimeAgo date={rowData.createdAt} />}
      />
    );
  };

  const header = (
    <SearchFilter
      title="Members"
      subTitle="Members of this project"
      filters={filters}
      setFilters={setFilters}
    />
  );

  const inviteNewMemberButton = (
    <>
      <div className="flex justify-content-end mb-3">
        <Button
          label="Invite new member"
          className="p-button-sm"
          onClick={() => setShow(true)}
        />
      </div>
    </>
  );

  return (
    <>
      <ConfirmPopup />
      <AdminOrOwner>{inviteNewMemberButton}</AdminOrOwner>
      <DataTable
        loading={isLoading}
        value={members?.data || []}
        filters={filters}
        header={header}
        {...TABLE_PROPS}
      >
        <Column field="inviteeEmail" header="Email" body={emailBody}></Column>
        <Column
          field="createdAt"
          header="Invited Date"
          body={createdAtBody}
        ></Column>
        <Column field="role" header="Role"></Column>
        <Column field="status" header="Status" body={statusBody}></Column>
        <Column field="action" header="Action" body={actionBody}></Column>
      </DataTable>

      {show && (
        <ManageMemberDialog
          show={show}
          data=""
          onDelete={() => {}}
          onSubmit={inviteNewMember}
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
}

export default Members;
