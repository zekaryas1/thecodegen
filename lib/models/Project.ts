export type Project = Partial<{
  id: string;
  name: string;
  description: string;
  creatorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  isOwner: boolean;
}>;
