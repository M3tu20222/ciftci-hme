import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Tarla from "@/models/Tarla";
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
    const tarla = await Tarla.findById(params.id).populate(
      "sezon_id urun_id kuyu_id"
    );
    if (!tarla) {
      return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(tarla);
  } catch (error) {
    console.error("Tarla getirme hatası:", error);
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
    const updatedTarla = await Tarla.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updatedTarla) {
      return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(updatedTarla);
  } catch (error) {
    console.error("Tarla güncelleme hatası:", error);
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
    const deletedTarla = await Tarla.findByIdAndDelete(params.id);
    if (!deletedTarla) {
      return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: "Tarla başarıyla silindi" });
  } catch (error) {
    console.error("Tarla silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
