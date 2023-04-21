import { Project } from "./Project";
import {UserRole} from "./User";

export type Member = Partial<{
  id: string;
  project: Project;
  invitedDate: Date;
  inviteeEmail: string;
  inviterEmail: string;
  status: MemberStatus;
  role: UserRole;
  createdAt: Date;
}>;


export enum MemberStatus{
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}