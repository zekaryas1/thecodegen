import { HttpStatusCode } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getLoggedInUserEmail,
  isUserAdminOrOwnerMember,
  isUserMember,
} from "../../../../../lib/dbOperations";
import prisma from "../../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, projectId } = req.query;
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  if (req.method == "GET") {
    if (await isUserMember(projectId as string, loggedInUserEmail)) {
      const column = await prisma.column.findUnique({
        where: {
          id: id as string,
        },
        include: {
          constraint: true,
        },
      });
      return res.status(200).json({ data: column });
    }
  }

  if (req.method == "DELETE") {
    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      const column = await prisma.column.delete({
        where: {
          id: id as string,
        },
      });

      return res.status(200).json({ data: column });
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
