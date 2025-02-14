import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Sahiplik from "@/models/Sahiplik";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const sahiplikler = await Sahiplik.find({}).populate(
      "envanter_id sahip_id"
    );
    return NextResponse.json(sahiplikler);
  } catch (error) {
    console.error("Sahiplikleri getirme hatası:", error);
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
    const yeniSahiplik = new Sahiplik(body);
    await yeniSahiplik.save();
    return NextResponse.json(yeniSahiplik, { status: 201 });
  } catch (error) {
    console.error("Sahiplik ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
