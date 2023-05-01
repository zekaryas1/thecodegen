import { Member } from "../../lib/models/Member";
import { UserRole } from "../../lib/models/User";
import { MemberService } from "../../lib/services/MemberService";

export class MembersUtils {
  static inviteNewMember = async (input: {
    newMembersEmail: string;
    projectId: string;
    onSuccess: (response: Member) => void;
  }) => {
    const response = await MemberService.create(
      {
        inviteeEmail: input.newMembersEmail,
      },
      input.projectId
    );
    if (response.statusText === "OK") {
      input.onSuccess(response.data);
    }
  };

  static deleteMember = async (input: {
    memberId: string;
    projectId: string;
    onSuccess: (response: Member) => void;
  }) => {
    const res = await MemberService.delete(input.memberId, input.projectId);
    if (res.statusText === "OK") {
      input.onSuccess(res.data);
    }
  };

  static updateRoleTo = async (input: {
    role: UserRole;
    data: Member;
    projectId: string;
    onSuccess: () => void;
  }) => {
    const res = await MemberService.update(
      {
        ...input.data,
        role: input.role,
      },
      input.projectId
    );
    if (res.statusText === "OK") {
      input.onSuccess();
    }
  };

  static removeMemberButton = (input: {
    data: Member;
    currentLoggedInUserEmail: string;
    leaveProjectButton: () => JSX.Element;
    removeUserButton: () => JSX.Element;
  }) => {
    if (
      input.data.role !== UserRole.OWNER &&
      input.data.inviteeEmail === input.currentLoggedInUserEmail
    ) {
      return input.leaveProjectButton();
    } else if (input.data.role !== UserRole.OWNER) {
      return input.removeUserButton();
    }
    return null;
  };
}
