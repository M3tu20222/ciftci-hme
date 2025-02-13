import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Tarla from "@/models/Tarla";
import dbConnect from "@/lib/mongodb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const tarlalar = await Tarla.find({}).populate("sezon_id urun_id kuyu_id");
    return NextResponse.json(tarlalar);
  } catch (error) {
    console.error("Tarlalar getirme hatası:", error);
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
    const yeniTarla = new Tarla(body);
    await yeniTarla.save();
    return NextResponse.json(yeniTarla, { status: 201 });
  } catch (error) {
    console.error("Tarla ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
