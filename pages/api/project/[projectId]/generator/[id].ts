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
      const generator = await prisma.generator.findUnique({
        where: {
          id: id as string,
        },
        include: {
          template: true,
        },
      });
      return res.status(HttpStatusCode.Ok).json({ data: generator });
    }
  }

  if (req.method == "DELETE") {
    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      const generator = await prisma.generator.delete({
        where: {
          id: id as string,
        },
      });

      return res.status(HttpStatusCode.Ok).json({ data: generator });
    }
  }

  if (req.method == "PUT") {
    const { name } = req.body;
    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      const generator = await prisma.generator.update({
        data: {
          name: name,
        },
        where: {
          id: id as string,
        },
      });

      return res.status(HttpStatusCode.Ok).json({ data: generator });
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
