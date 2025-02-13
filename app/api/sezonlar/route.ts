import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Sezon from "@/models/Sezon";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const sezonlar = await Sezon.find({}).sort({ baslangic_tarihi: -1 });
    return NextResponse.json(sezonlar);
  } catch (error) {
    console.error("Sezonları getirme hatası:", error);
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
    const { ad, baslangic_tarihi, bitis_tarihi } = await request.json();
    const yeniSezon = new Sezon({
      ad,
      baslangic_tarihi,
      bitis_tarihi,
      created_by: session.user.id,
    });
    await yeniSezon.save();
    return NextResponse.json(yeniSezon, { status: 201 });
  } catch (error) {
    console.error("Sezon ekleme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
