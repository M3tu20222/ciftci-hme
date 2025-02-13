import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TarlaIsleme from "@/models/TarlaIsleme";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tarlaIsleme = await TarlaIsleme.findById(params.id)
      .populate("envanter_id", "ad")
      .populate("tarla_id", "ad")
      .populate("created_by", "name");
    if (!tarlaIsleme) {
      return NextResponse.json(
        { error: "Tarla işleme bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(tarlaIsleme);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updatedTarlaIsleme = await TarlaIsleme.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );
    if (!updatedTarlaIsleme) {
      return NextResponse.json(
        { error: "Tarla işleme bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedTarlaIsleme);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deletedTarlaIsleme = await TarlaIsleme.findByIdAndDelete(params.id);
    if (!deletedTarlaIsleme) {
      return NextResponse.json(
        { error: "Tarla işleme bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Tarla işleme başarıyla silindi" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
