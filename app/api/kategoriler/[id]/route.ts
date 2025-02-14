import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Kategori from "@/models/Kategori";

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
    const kategori = await Kategori.findById(params.id).populate(
      "ust_kategori_id"
    );
    if (!kategori) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(kategori);
  } catch (error) {
    console.error("Kategori getirme hatası:", error);
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
    if (body.ust_kategori_id === "0" || body.ust_kategori_id === null) {
      body.ust_kategori_id = undefined;
    }
    const updatedKategori = await Kategori.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updatedKategori) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedKategori);
  } catch (error) {
    console.error("Kategori güncelleme hatası:", error);
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
    const deletedKategori = await Kategori.findByIdAndDelete(params.id);
    if (!deletedKategori) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Kategori başarıyla silindi" });
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
