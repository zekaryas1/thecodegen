import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { MemberService } from "../../../lib/services/MemberService";
import { useSession } from "next-auth/react";
import SearchFilter, { useFilters } from "../../../components/SearchFilter";
import { Member } from "../../../lib/models/Member";
import { UserRole } from "../../../lib/models/User";
import { Button } from "primereact/button";
import { myConfirmPopUp } from "../../../components/MyConfirmPopup";
import AdminOrOwner from "../../../components/AdminOrOwner";
import ToggleRole from "../../../components/Members/ToggleUserRole";
import { Chip } from "primereact/chip";
import { STATUS_COLORS, TABLE_PROPS } from "../../../lib/fixed";
import TimeAgo from "react-timeago";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ManageMemberDialog from "../../../components/Members/ManageMemberDialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import Conditional from "../../../components/Conditional";

function Members() {
  const router = useRouter();
  const { projectId } = router.query;
  const [show, setShow] = useState(false);
  const {
    data: members,
    isLoading,
    mutate,
  } = useSWR(MemberService.getBaseUrl(projectId));
  const { data: session } = useSession();
  const [filters, setFilters] = useFilters();

  const inviteNewMember = async (email: string) => {
    const response = await MemberService.create(
      {
        inviteeEmail: email,
      },
      projectId
    );
    mutate({ ...members, response });
  };

  const deleteMember = async (id: string) => {
    await MemberService.delete(id, projectId);
    mutate({ ...members.data.filter((it: Member) => it.id !== id) });
  };

  const actionBody = (data: Member) => {
    const updateRoleTo = async (role: UserRole) => {
      const res = await MemberService.update(
        {
          ...data,
          role: role,
        },
        projectId
      );
      mutate();
    };

    /**
     * Returns a React Button component that can be clicked to remove a member.
     *
     * @return {React.Component|null} A React Button component or null.
     */

    const removeMemberButton = () => {
      const buttonToShow = (label: string) => (
        <Button
          label={label}
          className="p-button-sm p-button-danger p-button-text"
          onClick={(event) => {
            myConfirmPopUp({
              event: event,
              acceptCallBack: () => data.id && deleteMember(data.id),
            });
          }}
        />
      );

      // we only show - remove button when
      // current user is not the project owner
      //owner can not be removed
      // when the user is the current logged in user
      //users can remove themselves from a project
      // and the user is an admin
      //an admin can remove other not owner members
      if (
        data.role !== UserRole.OWNER &&
        data.inviteeEmail === session?.user?.email
      ) {
        return buttonToShow("Leave project");
      } else if (data.role !== UserRole.OWNER) {
        return <AdminOrOwner>{buttonToShow("Remove user")}</AdminOrOwner>;
      }
      return null;
    };

    /**
     * Returns a JSX element that conditionally renders a ToggleRole component if
     * the data.role prop is truthy.
     *
     * @returns {JSX.Element} The JSX element to render.
     */
    const toggleRoleOptions = (): JSX.Element => {
      return (
        <Conditional
          if={data.role}
          show={
            <AdminOrOwner>
              <ToggleRole oldRole={data.role!} onClick={updateRoleTo} />
            </AdminOrOwner>
          }
        />
      );
    };

    return (
      <>
        <div className="flex">
          {removeMemberButton()}
          {toggleRoleOptions()}
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
