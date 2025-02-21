import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import TarlaIsleme from "@/models/TarlaIsleme";

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
    const tarlaIsleme = await TarlaIsleme.findById(params.id)
      .populate("tarla_id", "ad")
      .populate("created_by", "name");

    if (!tarlaIsleme) {
      return NextResponse.json(
        { error: "Tarla işleme kaydı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(tarlaIsleme);
  } catch (error: any) {
    console.error("Tarla işleme getirme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
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
        { error: "Tarla işleme kaydı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTarlaIsleme);
  } catch (error: any) {
    console.error("Tarla işleme güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
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
        { error: "Tarla işleme kaydı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Tarla işleme kaydı başarıyla silindi",
    });
  } catch (error: any) {
    console.error("Tarla işleme silme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
