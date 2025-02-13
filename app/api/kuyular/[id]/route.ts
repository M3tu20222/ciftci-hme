import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Kuyu from "@/models/Kuyu";
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
    const kuyu = await Kuyu.findById(params.id);
    if (!kuyu) {
      return NextResponse.json({ error: "Kuyu bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(kuyu);
  } catch (error) {
    console.error("Kuyu getirme hatası:", error);
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
    const updatedKuyu = await Kuyu.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updatedKuyu) {
      return NextResponse.json({ error: "Kuyu bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(updatedKuyu);
  } catch (error) {
    console.error("Kuyu güncelleme hatası:", error);
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
    const deletedKuyu = await Kuyu.findByIdAndDelete(params.id);
    if (!deletedKuyu) {
      return NextResponse.json({ error: "Kuyu bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: "Kuyu başarıyla silindi" });
  } catch (error) {
    console.error("Kuyu silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
