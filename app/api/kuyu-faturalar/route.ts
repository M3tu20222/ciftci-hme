import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import KuyuFatura from "@/models/KuyuFatura";

export async function GET() {
  try {
    await dbConnect();
    const kuyuFaturalar = await KuyuFatura.find({})
      .sort({ createdAt: -1 })
      .populate("kuyu_id", "ad");
    return NextResponse.json(kuyuFaturalar);
  } catch (error) {
    console.error("Kuyu faturalarını getirme hatası:", error);
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
    const { kuyu_id, baslangic_tarihi, bitis_tarihi, tutar, odendi } =
      await request.json();
    const yeniKuyuFatura = new KuyuFatura({
      kuyu_id,
      baslangic_tarihi,
      bitis_tarihi,
      tutar,
      odendi,
      created_by: session.user.id,
    });
    await yeniKuyuFatura.save();
    return NextResponse.json(yeniKuyuFatura, { status: 201 });
  } catch (error) {
    console.error("Kuyu faturası ekleme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
