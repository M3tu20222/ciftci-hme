import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MazotTuketimKarti from "@/models/MazotTuketimKarti";
import dbConnect from "@/lib/mongodb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const mazotTuketimKartlari = await MazotTuketimKarti.find({}).populate(
      "tarla_id"
    );
    return NextResponse.json(mazotTuketimKartlari);
  } catch (error) {
    console.error("Mazot tüketim kartları getirme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    const yeniMazotTuketimKarti = new MazotTuketimKarti(body);
    await yeniMazotTuketimKarti.save();
    return NextResponse.json(yeniMazotTuketimKarti, { status: 201 });
  } catch (error) {
    console.error("Mazot tüketim kartı ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
