import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Urun from "@/models/Urun";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const urunler = await Urun.find({})
      .sort({ createdAt: -1 })
      .populate("sezon_id", "ad");
    return NextResponse.json(urunler);
  } catch (error) {
    console.error("Ürünleri getirme hatası:", error);
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
    const { ad, kategori, marka, birim, sezon_id } = await request.json();
    const yeniUrun = new Urun({
      ad,
      kategori,
      marka,
      birim,
      sezon_id,
      created_by: session.user.id,
    });
    await yeniUrun.save();
    return NextResponse.json(yeniUrun, { status: 201 });
  } catch (error) {
    console.error("Ürün ekleme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
