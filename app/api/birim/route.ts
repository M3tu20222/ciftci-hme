import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Birim from "@/models/Birim";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const birimler = await Birim.find({ aktif: true });
    return NextResponse.json(birimler);
  } catch (error: any) {
    console.error("Birimleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
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
    const yeniBirim = new Birim(body);
    await yeniBirim.save();
    return NextResponse.json(yeniBirim, { status: 201 });
  } catch (error: any) {
    console.error("Birim ekleme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
