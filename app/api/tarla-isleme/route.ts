import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TarlaIsleme from "@/models/TarlaIsleme";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
  await dbConnect();
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tarlaIslemeler = await TarlaIsleme.find({})
      .populate("envanter_id", "ad")
      .populate("tarla_id", "ad")
      .populate("created_by", "name");
    return NextResponse.json(tarlaIslemeler);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newTarlaIsleme = new TarlaIsleme({
      ...body,
      created_by: token.sub,
    });
    const savedTarlaIsleme = await newTarlaIsleme.save();
    return NextResponse.json(savedTarlaIsleme, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
