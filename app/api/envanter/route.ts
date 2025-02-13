import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Envanter from "@/models/Envanter";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const envanterItems = await Envanter.find({})
      .sort({ createdAt: -1 })
      .populate("sahipler.sahip", "name");
    return NextResponse.json(envanterItems);
  } catch (error) {
    console.error("Envanter öğelerini getirme hatası:", error);
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
    const envanterData = await request.json();
    const yeniEnvanter = new Envanter({
      ...envanterData,
      created_by: session.user.id,
    });
    await yeniEnvanter.save();
    return NextResponse.json(yeniEnvanter, { status: 201 });
  } catch (error) {
    console.error("Envanter öğesi ekleme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
