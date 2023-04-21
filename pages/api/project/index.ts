import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getLoggedInUserEmail } from "../../../lib/dbOperations";
import { MemberStatus } from "../../../lib/models/Member";
import { UserRole } from "../../../lib/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  if (req.method == "GET") {
    const memberProjects = await prisma.member.findMany({
      where: {
        inviteeEmail: loggedInUserEmail,
        status: MemberStatus.ACCEPTED,
      },
      select: {
        project: true,
      },
    });

    return res.status(200).json({
      data: memberProjects.map((memberProject) => {
        return {
          isOwner: memberProject.project?.creatorEmail === loggedInUserEmail,
          ...memberProject.project,
        };
      }),
    });
  }

  if (req.method == "POST") {
    const { name, description } = req.body;

    const newProject = await prisma.project.create({
      data: {
        name: name,
        description: description,
        creatorEmail: loggedInUserEmail,
        members: {
          create: {
            status: MemberStatus.ACCEPTED,
            role: UserRole.OWNER,
            inviterEmail: loggedInUserEmail,
            inviteeEmail: loggedInUserEmail,
          },
        },
      },
    });

    return res.status(200).json({ data: newProject });
  }
}
