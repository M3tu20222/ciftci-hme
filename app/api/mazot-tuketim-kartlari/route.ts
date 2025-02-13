import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MazotTuketimKarti from "@/models/MazotTuketimKarti";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mazotTuketimKartlari = await MazotTuketimKarti.find({}).sort({
      ad: 1,
    });
    return NextResponse.json(mazotTuketimKartlari);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const mazotTuketimKarti = new MazotTuketimKarti(data);
    await mazotTuketimKarti.save();
    return NextResponse.json(mazotTuketimKarti, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
