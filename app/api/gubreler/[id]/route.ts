import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Gubre from "@/models/Gubre";
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
    const gubre = await Gubre.findById(params.id);
    if (!gubre) {
      return NextResponse.json({ error: "Gübre bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(gubre);
  } catch (error) {
    console.error("Gübre getirme hatası:", error);
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
    const updatedGubre = await Gubre.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updatedGubre) {
      return NextResponse.json({ error: "Gübre bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(updatedGubre);
  } catch (error) {
    console.error("Gübre güncelleme hatası:", error);
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
    const deletedGubre = await Gubre.findByIdAndDelete(params.id);
    if (!deletedGubre) {
      return NextResponse.json({ error: "Gübre bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: "Gübre başarıyla silindi" });
  } catch (error) {
    console.error("Gübre silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
