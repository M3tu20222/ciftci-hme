import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Sahip from "@/models/Sahip";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const sahipler = await Sahip.find({}).sort({ createdAt: -1 });
    return NextResponse.json(sahipler);
  } catch (error) {
    console.error("Sahipleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { ad, tip } = await request.json();
    const yeniSahip = new Sahip({
      ad,
      tip,
      created_by: session.user.id,
    });
    await yeniSahip.save();
    return NextResponse.json(yeniSahip, { status: 201 });
  } catch (error) {
    console.error("Sahip ekleme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
