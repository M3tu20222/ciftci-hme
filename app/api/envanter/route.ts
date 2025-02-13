import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Envanter from "@/models/Envanter";
import dbConnect from "@/lib/mongodb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const envanterler = await Envanter.find({});
    return NextResponse.json(envanterler);
  } catch (error) {
    console.error("Envanter getirme hatası:", error);
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
    const yeniEnvanter = new Envanter(body);
    await yeniEnvanter.save();
    return NextResponse.json(yeniEnvanter, { status: 201 });
  } catch (error) {
    console.error("Envanter ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
