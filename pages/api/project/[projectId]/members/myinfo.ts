import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { HttpStatusCode } from "axios";
import {
  getLoggedInUserEmail,
  isUserAdminOrOwnerMember,
} from "../../../../../lib/dbOperations";
import { MemberStatus } from "../../../../../lib/models/Member";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectId } = req.query;
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  //for frontend to check if a user is admin
  if (req.method == "GET") {
    const member = await prisma.member.findFirst({
      where: {
        inviteeEmail: loggedInUserEmail,
        projectId: projectId as string,
        status: MemberStatus.ACCEPTED,
      },
    });

    return res.status(200).json({ data: member });
  }

  return res.status(HttpStatusCode.MethodNotAllowed).json({
    message: "Method not allowed",
  });
}
