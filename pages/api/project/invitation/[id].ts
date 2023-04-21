import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { getLoggedInUserEmail } from "../../../../lib/dbOperations";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  if (req.method == "PUT") {
    const { status } = req.body;
    const member = await prisma.member.updateMany({
      data: {
        status: status,
      },
      where: {
        id: id as string,
        inviteeEmail: loggedInUserEmail,
      },
    });

    return res.status(200).json({ data: member });
  }
}
