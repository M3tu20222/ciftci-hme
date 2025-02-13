import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TarlaIsleme from "@/models/TarlaIsleme";
import dbConnect from "@/lib/mongodb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const tarlaIslemeler = await TarlaIsleme.find({}).populate("tarla_id");
    return NextResponse.json(tarlaIslemeler);
  } catch (error) {
    console.error("Tarla işlemeleri getirme hatası:", error);
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
    const yeniTarlaIsleme = new TarlaIsleme(body);
    await yeniTarlaIsleme.save();
    return NextResponse.json(yeniTarlaIsleme, { status: 201 });
  } catch (error) {
    console.error("Tarla işleme ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
