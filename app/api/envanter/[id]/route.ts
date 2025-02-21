import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import {Kategori} from "@/models/Kategori";
import Envanter from "@/models/Envanter";
Kategori
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
    const envanter = await Envanter.findById(params.id)
      .populate("kategori_id")
      .populate("sahiplikler.sahip_id", "name");
    if (!envanter) {
      return NextResponse.json(
        { error: "Envanter bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(envanter);
  } catch (error) {
    console.error("Envanter getirme hatası:", error);
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
    const updatedEnvanter = await Envanter.findByIdAndUpdate(
      params.id,
      {
        ...body,
        yakitTuketimi: body.yakitTuketimi || 0, // Ensure yakitTuketimi is always a number
      },
      { new: true }
    );
    if (!updatedEnvanter) {
      return NextResponse.json(
        { error: "Envanter bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedEnvanter);
  } catch (error) {
    console.error("Envanter güncelleme hatası:", error);
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
    const deletedEnvanter = await Envanter.findByIdAndDelete(params.id);
    if (!deletedEnvanter) {
      return NextResponse.json(
        { error: "Envanter bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Envanter başarıyla silindi" });
  } catch (error) {
    console.error("Envanter silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
