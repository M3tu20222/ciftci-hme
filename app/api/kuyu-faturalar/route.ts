import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import KuyuFatura from "@/models/KuyuFatura";
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
    const kuyuFatura = await KuyuFatura.findById(params.id).populate("kuyu_id");
    if (!kuyuFatura) {
      return NextResponse.json(
        { error: "Kuyu faturası bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(kuyuFatura);
  } catch (error) {
    console.error("Kuyu faturası getirme hatası:", error);
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
    const updatedKuyuFatura = await KuyuFatura.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );
    if (!updatedKuyuFatura) {
      return NextResponse.json(
        { error: "Kuyu faturası bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedKuyuFatura);
  } catch (error) {
    console.error("Kuyu faturası güncelleme hatası:", error);
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
    const deletedKuyuFatura = await KuyuFatura.findByIdAndDelete(params.id);
    if (!deletedKuyuFatura) {
      return NextResponse.json(
        { error: "Kuyu faturası bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Kuyu faturası başarıyla silindi" });
  } catch (error) {
    console.error("Kuyu faturası silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
