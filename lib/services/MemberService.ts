import axios from "axios";
import { Member } from "../models/Member";
import { IdType } from "./EntityService";

export class MemberService {
  static getBaseUrl = (projectId: IdType) => {
    return `/api/project/${projectId}/members`;
  };

  static myInfo = (projectId: IdType) => {
    return MemberService.getBaseUrl(projectId)+"/myinfo";
  }

  static create = async (member: Member, projectId: IdType) => {
    return await axios.post(MemberService.getBaseUrl(projectId), member);
  };

  static update = async (member: Member, projectId: IdType) => {
    return await axios.put(
      MemberService.getBaseUrl(projectId) + `/${member.id}`,
      member
    );
  };

  static delete = async (memberId: string, projectId: IdType) => {
    return await axios.delete(
      MemberService.getBaseUrl(projectId) + `/${memberId}`
    );
  };
}
