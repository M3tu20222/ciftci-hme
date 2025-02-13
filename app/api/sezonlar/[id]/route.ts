import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sezon from "@/models/Sezon";
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
    const sezon = await Sezon.findById(params.id);
    if (!sezon) {
      return NextResponse.json({ error: "Sezon bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(sezon);
  } catch (error) {
    console.error("Sezon getirme hatası:", error);
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
    const updatedSezon = await Sezon.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updatedSezon) {
      return NextResponse.json({ error: "Sezon bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(updatedSezon);
  } catch (error) {
    console.error("Sezon güncelleme hatası:", error);
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
    const deletedSezon = await Sezon.findByIdAndDelete(params.id);
    if (!deletedSezon) {
      return NextResponse.json({ error: "Sezon bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: "Sezon başarıyla silindi" });
  } catch (error) {
    console.error("Sezon silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
