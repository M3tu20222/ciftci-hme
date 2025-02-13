import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Tarla from "@/models/Tarla";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const tarlalar = await Tarla.find({})
      .sort({ createdAt: -1 })
      .populate("kuyu_id", "ad")
      .populate("sezon_id", "ad")
      .populate("urun_id", "ad")
      .lean();
    return NextResponse.json(tarlalar);
  } catch (error) {
    console.error("Tarlaları getirme hatası:", error);
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
    const {
      ad,
      dekar,
      durum,
      sulanan,
      kiralik,
      ada_parsel,
      sezon_id,
      urun_id,
      kuyu_id,
    } = await request.json();
    const yeniTarla = new Tarla({
      ad,
      dekar,
      durum,
      sulanan,
      kiralik: kiralik || false,
      ada_parsel,
      sezon_id,
      urun_id,
      kuyu_id: kuyu_id || null,
      created_by: session.user.id,
    });
    await yeniTarla.save();
    return NextResponse.json(yeniTarla, { status: 201 });
  } catch (error) {
    console.error("Tarla ekleme hatası:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Internal Server Error", details: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
