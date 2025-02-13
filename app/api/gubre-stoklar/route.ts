import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GubreStok from "@/models/GubreStok";
import dbConnect from "@/lib/mongodb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const gubreStoklar = await GubreStok.find({}).populate("gubre_id");
    return NextResponse.json(gubreStoklar);
  } catch (error) {
    console.error("Gübre stokları getirme hatası:", error);
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
    const yeniGubreStok = new GubreStok(body);
    await yeniGubreStok.save();
    return NextResponse.json(yeniGubreStok, { status: 201 });
  } catch (error) {
    console.error("Gübre stok ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
