import { Member, MemberStatus } from "../../lib/models/Member";
import { InvitationService } from "../../lib/services/InvitationService";

export class InvitationsUtils {
  static acceptInvitation = async (input: {
    member: Member;
    onSuccess: () => void;
  }) => {
    const response = await InvitationService.update({
      ...input.member,
      status: MemberStatus.ACCEPTED,
    });
    if (response.statusText === "OK") {
      input.onSuccess();
    }
  };

  static rejectInvitation = async (input: {
    member: Member;
    onSuccess: () => void;
  }) => {
    const response = await InvitationService.update({
      ...input.member,
      status: MemberStatus.REJECTED,
    });
    if (response.statusText === "OK") {
      input.onSuccess();
    }
  };
}
