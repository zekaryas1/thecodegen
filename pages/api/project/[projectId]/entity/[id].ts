import type { NextApiRequest, NextApiResponse } from "next";
import {
  getLoggedInUserEmail,
  isUserAdminOrOwnerMember,
} from "../../../../../lib/dbOperations";
import prisma from "../../../../../lib/prisma";
import { HttpStatusCode } from "axios";
import { MemberStatus } from "../../../../../lib/models/Member";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, projectId } = req.query;
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

  if (req.method == "DELETE") {
    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      const entity = await prisma.entity.delete({
        where: {
          id: id as string,
        },
      });

      return res.status(200).json({ data: entity });
    }
  }

  if (req.method == "PUT") {
    const { name } = req.body;
    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      const entity = await prisma.entity.update({
        data: {
          name: name,
        },
        where: {
          id: id as string,
        },
      });

      return res.status(200).json({ data: entity });
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
