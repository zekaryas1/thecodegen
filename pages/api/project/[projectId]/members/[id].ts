import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { HttpStatusCode } from "axios";
import {
  getLoggedInUserEmail,
  isUserAdminOrOwnerMember,
} from "../../../../../lib/dbOperations";
import { UserRole } from "../../../../../lib/models/User";
import { log } from "util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, projectId } = req.query;
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  if (req.method == "DELETE") {
    const member = await prisma.member.findUnique({
      where: {
        id: id as string,
      },
    });

    if (
      member?.inviteeEmail === loggedInUserEmail ||
      (await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail))
    ) {
      const deletedMember = await prisma.member.deleteMany({
        where: {
          id: id as string,
          role: {
            in: [UserRole.ADMIN, UserRole.USER],
          },
        },
      });

      return res.status(200).json({ data: deletedMember });
    }
  }

  if (req.method == "PUT") {
    const { role } = req.body;

    if (
      (await isUserAdminOrOwnerMember(
        projectId as string,
        loggedInUserEmail
      )) &&
      role !== UserRole.OWNER
    ) {
      const member = await prisma.member.updateMany({
        data: {
          role: role,
        },
        where: {
          id: id as string,
          role: {
            in: [UserRole.ADMIN, UserRole.USER],
          },
        },
      });

      return res.status(200).json({ data: member });
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
