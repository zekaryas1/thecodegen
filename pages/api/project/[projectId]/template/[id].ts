import type { NextApiRequest, NextApiResponse } from "next";
import {
  getLoggedInUserEmail,
  isUserAdminOrOwnerMember,
} from "../../../../../lib/dbOperations";
import prisma from "../../../../../lib/prisma";
import { HttpStatusCode } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, projectId } = req.query;
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  if (req.method == "PUT") {
    const { body } = req.body;

    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      const template = await prisma.template.update({
        where: {
          id: id as string,
        },
        data: {
          body: body,
        },
      });

      return res.status(200).json({ data: template });
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
