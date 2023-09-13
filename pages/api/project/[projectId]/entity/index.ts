import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import {
  getLoggedInUserEmail,
  isUserAdminOrOwnerMember,
} from "../../../../../lib/dbOperations";
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
            entity: {
              orderBy: {
                createdAt: "desc",
              },
              include: {
                columns: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  include: {
                    constraint: {
                      orderBy: {
                        createdAt: "desc",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ data: member?.project?.entity });
  }

  if (req.method == "POST") {
    const { name } = req.body;

    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      const newEntity = await prisma.entity.create({
        data: {
          creatorEmail: loggedInUserEmail,
          project: {
            connect: {
              id: projectId as string,
            },
          },
          name: name,
        },
      });

      return res.status(200).json({ data: newEntity });
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
