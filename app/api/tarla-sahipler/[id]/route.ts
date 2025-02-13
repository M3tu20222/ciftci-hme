import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import TarlaSahip from "@/models/TarlaSahip";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const tarlaSahip = await TarlaSahip.findById(params.id)
      .populate("tarla_id", "ad")
      .populate("sahip_id", "ad")
      .populate("created_by", "ad");
    if (!tarlaSahip) {
      return NextResponse.json(
        { error: "Tarla Sahip not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(tarlaSahip);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    const updatedTarlaSahip = await TarlaSahip.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );
    if (!updatedTarlaSahip) {
      return NextResponse.json(
        { error: "Tarla Sahip not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedTarlaSahip);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const deletedTarlaSahip = await TarlaSahip.findByIdAndDelete(params.id);
    if (!deletedTarlaSahip) {
      return NextResponse.json(
        { error: "Tarla Sahip not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Tarla Sahip deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
