import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { Column } from "../../../../../lib/models/Column";
import {
  getLoggedInUserEmail,
  isUserAdminOrOwnerMember,
} from "../../../../../lib/dbOperations";
import { HttpStatusCode } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectId } = req.query;
  const loggedInUserEmail = await getLoggedInUserEmail(req, res);

  //both edit and save happen here
  if (req.method == "POST") {
    const { entityId, id, name, type, constraint }: Required<Column> = req.body;

    if (
      await isUserAdminOrOwnerMember(projectId as string, loggedInUserEmail)
    ) {
      //delete previous column and related constraints
      if (id) {
        await prisma.column.delete({
          where: {
            id: id as string,
          },
        });
      }

      const column = await prisma.column.create({
        data: {
          entity: {
            connect: {
              id: entityId,
            },
          },
          name: name,
          type: type,
          creatorEmail: loggedInUserEmail,
          constraint: {
            create: constraint.map((constraint) => {
              return {
                name: constraint.name,
                type: constraint.type,
                value: constraint.value,
                creatorEmail: loggedInUserEmail,
              };
            }),
          },
        },
        include: {
          constraint: true,
        },
      });

      return res.status(200).json({ data: column });
    }
  }

  return res.status(HttpStatusCode.Forbidden).json({
    message: "You are not authorized to perform this action",
  });
}
