import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import KuyuFatura from "@/models/KuyuFatura";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const kuyuFaturalar = await KuyuFatura.find({})
      .populate("kuyu_id", "ad")
      .sort({ baslangic_tarihi: -1 })
      .lean();

    return NextResponse.json(kuyuFaturalar);
  } catch (error: any) {
    console.error("Kuyu faturaları getirme hatası:", error);
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
    const yeniKuyuFatura = new KuyuFatura({
      ...body,
      created_by: session.user.id, // Add created_by from session
    });
    await yeniKuyuFatura.save();
    return NextResponse.json(yeniKuyuFatura, { status: 201 });
  } catch (error: any) {
    console.error("Kuyu faturası ekleme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
