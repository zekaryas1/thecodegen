import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import {
  getLoggedInUserEmail,
  isUserAdminOrOwnerMember,
} from "../../../../../lib/dbOperations";
import { DEFAULT_TEMPLATE } from "../../../../../lib/fixed";
import { HttpStatusCode } from "axios";
import { MemberStatus } from "../../../../../lib/models/Member";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectId } = req.query;
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  if (req.method == "GET") {
    const member = await prisma.member.findFirst({
      where: {
        inviteeEmail: loggedInUserEmail,
        projectId: projectId as string,
        status: MemberStatus.ACCEPTED,
      },
      select: {
        project: {
          select: {
            generator: {
              orderBy: {
                createdAt: "desc",
              },
              include: {
                template: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ data: member?.project?.generator });
  }

  if (req.method == "POST") {
    const { name } = req.body;

    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      const generator = await prisma.generator.create({
        data: {
          name: name,
          template: {
            create: {
              body: DEFAULT_TEMPLATE,
            },
          },
          project: {
            connect: {
              id: projectId as string,
            },
          },
          creatorEmail: loggedInUserEmail,
        },
        include: {
          template: true,
        },
      });

      return res.status(200).json({ data: generator });
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
