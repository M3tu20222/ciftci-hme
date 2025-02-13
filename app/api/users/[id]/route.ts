import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (session) {
    // Fetch and return user data for the given id
    // For now, we'll just return a placeholder response
    return NextResponse.json({ message: `User data for id: ${params.id}` });
  } else {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (session) {
    // Update user data for the given id
    // For now, we'll just return a placeholder response
    return NextResponse.json({
      message: `Updated user data for id: ${params.id}`,
    });
  } else {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
