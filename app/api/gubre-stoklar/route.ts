import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import GubreStok from "@/models/GubreStok";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const gubreStoklar = await GubreStok.find({})
      .populate("gubre")
      .sort({ createdAt: -1 });
    return NextResponse.json(gubreStoklar);
  } catch (error) {
    console.error("Gübre stokları getirme hatası:", error);
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
    const { gubre, miktar, birim, alisTarihi, sonKullanmaTarihi, fiyat } =
      await request.json();
    const yeniGubreStok = new GubreStok({
      gubre,
      miktar,
      birim,
      alisTarihi,
      sonKullanmaTarihi,
      fiyat,
      created_by: session.user.id,
    });
    await yeniGubreStok.save();
    return NextResponse.json(yeniGubreStok, { status: 201 });
  } catch (error) {
    console.error("Gübre stok ekleme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
