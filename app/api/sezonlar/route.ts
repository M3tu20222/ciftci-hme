import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sezon from "@/models/Sezon";
import dbConnect from "@/lib/mongodb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const sezonlar = await Sezon.find({});
    return NextResponse.json(sezonlar);
  } catch (error) {
    console.error("Sezonlar getirme hatası:", error);
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
    const yeniSezon = new Sezon(body);
    await yeniSezon.save();
    return NextResponse.json(yeniSezon, { status: 201 });
  } catch (error) {
    console.error("Sezon ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
