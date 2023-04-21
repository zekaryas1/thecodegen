import axios from "axios";
import { Member } from "../models/Member";

export class InvitationService {
  static getBaseUrl = () => {
    return `/api/project/invitation`;
  };

  static update = async (member: Member) => {
    return await axios.put(
      InvitationService.getBaseUrl() + `/${member.id}`,
      member
    );
  };
}
