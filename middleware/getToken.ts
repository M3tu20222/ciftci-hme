import { getToken as getNextAuthToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function getToken(req: NextRequest) {
  const token = await getNextAuthToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  return token;
}
