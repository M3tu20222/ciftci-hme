import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TarlaSahip from "@/models/TarlaSahip";
import dbConnect from "@/lib/mongodb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const tarlaSahipler = await TarlaSahip.find({}).populate(
      "tarla_id sahip_id"
    );
    return NextResponse.json(tarlaSahipler);
  } catch (error) {
    console.error("Tarla sahipleri getirme hatası:", error);
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
    const yeniTarlaSahip = new TarlaSahip(body);
    await yeniTarlaSahip.save();
    return NextResponse.json(yeniTarlaSahip, { status: 201 });
  } catch (error) {
    console.error("Tarla sahip ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
