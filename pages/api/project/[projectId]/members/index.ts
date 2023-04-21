import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { HttpStatusCode } from "axios";
import { Prisma } from "@prisma/client";
import {
  getLoggedInUserEmail,
  isUserAdminOrOwnerMember,
  isUserMember,
} from "../../../../../lib/dbOperations";
import { MemberStatus } from "../../../../../lib/models/Member";
import { UserRole } from "../../../../../lib/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  const { projectId } = req.query;

  if (req.method == "GET") {
    if (await isUserMember(projectId as string, loggedInUserEmail)) {
      const members = await prisma.member.findMany({
        where: {
          projectId: projectId as string,
        },
      });
      return res.status(HttpStatusCode.Ok).json({ data: members });
    }
  }

  if (req.method == "POST") {
    const { inviteeEmail } = req.body;

    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      try {
        const newMember = await prisma.member.create({
          data: {
            role: UserRole.USER,
            status: MemberStatus.PENDING,
            inviteeEmail: inviteeEmail,
            inviterEmail: loggedInUserEmail,
            project: {
              connect: {
                id: projectId as string,
              },
            },
          },
        });

        return res.status(HttpStatusCode.Created).json({ data: newMember });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            return res.status(HttpStatusCode.BadRequest).json({
              message: "User is already a member of this project",
            });
          }
        }
        throw error;
      }
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
