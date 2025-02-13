import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    // Signed in
    res.status(200).json({ message: "Signed in", session });
  } else {
    // Not Signed in
    res.status(401).json({ message: "Not Signed In" });
  }
}
