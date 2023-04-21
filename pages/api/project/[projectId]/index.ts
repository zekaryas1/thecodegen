import type { NextApiRequest, NextApiResponse } from "next";
import {
  getLoggedInUserEmail,
  isUserMember,
  isUserProjectOwner,
} from "../../../../lib/dbOperations";
import prisma from "../../../../lib/prisma";
import { HttpStatusCode } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectId } = req.query;
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  if (req.method == "GET") {
    if (await isUserMember(projectId as string, loggedInUserEmail)) {
      const project = await prisma.project.findUnique({
        where: {
          id: projectId as string,
        },
      });
      return res.status(200).json({ data: project });
    }
  }

  if (req.method == "DELETE") {
    if (await isUserProjectOwner(projectId as string, loggedInUserEmail)) {
      const project = await prisma.project.delete({
        where: {
          id: projectId as string,
        },
      });

      return res.status(200).json({ data: project });
    }
  }

  if (req.method == "PUT") {
    const { name, description } = req.body;
    if (await isUserProjectOwner(projectId as string, loggedInUserEmail)) {
      const project = await prisma.project.update({
        data: {
          name: name,
          description: description,
        },
        where: {
          id: projectId as string,
        },
      });

      return res.status(200).json({ data: project });
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
