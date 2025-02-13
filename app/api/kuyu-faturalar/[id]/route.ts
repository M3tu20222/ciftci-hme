import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import KuyuFatura from "@/models/KuyuFatura";
import dbConnect from "@/lib/mongodb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const kuyuFaturalar = await KuyuFatura.find({}).populate("kuyu_id");
    return NextResponse.json(kuyuFaturalar);
  } catch (error) {
    console.error("Kuyu faturaları getirme hatası:", error);
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
    const yeniKuyuFatura = new KuyuFatura(body);
    await yeniKuyuFatura.save();
    return NextResponse.json(yeniKuyuFatura, { status: 201 });
  } catch (error) {
    console.error("Kuyu faturası ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
