import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sahip from "@/models/Sahip";
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
    const sahip = await Sahip.findById(params.id);
    if (!sahip) {
      return NextResponse.json({ error: "Sahip bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(sahip);
  } catch (error) {
    console.error("Sahip getirme hatası:", error);
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
    const updatedSahip = await Sahip.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updatedSahip) {
      return NextResponse.json({ error: "Sahip bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(updatedSahip);
  } catch (error) {
    console.error("Sahip güncelleme hatası:", error);
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
    const deletedSahip = await Sahip.findByIdAndDelete(params.id);
    if (!deletedSahip) {
      return NextResponse.json({ error: "Sahip bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: "Sahip başarıyla silindi" });
  } catch (error) {
    console.error("Sahip silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
