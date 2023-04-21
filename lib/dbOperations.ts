import { NextApiRequest, NextApiResponse } from "next";
import prisma from "./prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { MemberStatus } from "./models/Member";
import { UserRole } from "./models/User";

/**
 * Check if user is admin or owner of the project with the given id in the database and return it.
 * @param projectId the id of the project
 * @param userEmail the email of the user
 * @returns
 */
export const isUserAdminOrOwnerMember = async (
  projectId: string,
  userEmail: string
) => {
  const userMemberInfo = await prisma.member.findFirst({
    where: {
      projectId: projectId,
      inviteeEmail: userEmail,
      status: MemberStatus.ACCEPTED,
      role: {
        in: [UserRole.ADMIN, UserRole.OWNER],
      },
    },
  });

  return userMemberInfo !== null;
};

/**
 * Checks if a given user email is a member of the specified project.
 *
 * @param projectId - The ID of the project to check membership for.
 * @param userEmail - The email of the user to check membership for.
 * @returns A Promise that resolves to a boolean indicating whether the user is a member.
 */

export const isUserMember = async (projectId: string, userEmail: string) => {
  const userMemberInfo = await prisma.member.findFirst({
    where: {
      projectId: projectId,
      inviteeEmail: userEmail,
      status: MemberStatus.ACCEPTED,
    },
  });

  return userMemberInfo !== null;
};

/**
 * Check if a user is the owner of a project.
 * @param projectId - The ID of the project to check.
 * @param userEmail - The email of the user to check.
 * @returns True if the user is the owner, false otherwise.
 */

export const isUserProjectOwner = async (
  projectId: string,
  userEmail: string
) => {
  const userMemberInfo = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });

  return userMemberInfo?.creatorEmail === userEmail;
};

/**
 * Asynchronously gets the logged-in user's email address from a server session.
 *
 * @param req The Next.js API request object.
 * @param res The Next.js API response object.
 * @returns The email address of the logged-in user, or an empty string if the user is not logged in or the email address is not available.
 */
export const getLoggedInUserEmail = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions);
  return session?.user?.email || "";
};
