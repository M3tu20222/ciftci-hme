import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function adminAuth(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  if (token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

