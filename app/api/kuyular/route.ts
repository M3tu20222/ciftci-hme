import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Kuyu from "@/models/Kuyu";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const kuyular = await Kuyu.find({}).sort({ createdAt: -1 });
    return NextResponse.json(kuyular);
  } catch (error) {
    console.error("Kuyuları getirme hatası:", error);
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
    const { ad, bolge, konum, derinlik, kapasite, durum, sezon_id } =
      await request.json();
    const yeniKuyu = new Kuyu({
      ad,
      bolge,
      konum,
      derinlik,
      kapasite,
      durum,
      sezon_id,
      created_by: session.user.id,
    });
    await yeniKuyu.save();
    return NextResponse.json(yeniKuyu, { status: 201 });
  } catch (error) {
    console.error("Kuyu ekleme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
