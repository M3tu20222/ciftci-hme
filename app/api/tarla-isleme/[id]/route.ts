import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TarlaIsleme from "@/models/TarlaIsleme";
import dbConnect from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const tarlaIsleme = await TarlaIsleme.findById(params.id).populate(
      "tarla_id"
    );
    if (!tarlaIsleme) {
      return NextResponse.json(
        { error: "Tarla işleme bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(tarlaIsleme);
  } catch (error) {
    console.error("Tarla işleme getirme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
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
    console.error("Tarla işleme güncelleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

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
    console.error("Tarla işleme silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
