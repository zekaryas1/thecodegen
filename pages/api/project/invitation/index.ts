import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { getLoggedInUserEmail } from "../../../../lib/dbOperations";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  if (req.method == "GET") {
    const invitation = await prisma.member.findMany({
      where: {
        inviteeEmail: loggedInUserEmail,
      },
      include: {
        project: true,
      },
    });
    return res.status(200).json({ data: invitation });
  }
}
