import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GubreStok from "@/models/GubreStok";
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
    const gubreStok = await GubreStok.findById(params.id).populate("gubre_id");
    if (!gubreStok) {
      return NextResponse.json(
        { error: "Gübre stok bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(gubreStok);
  } catch (error) {
    console.error("Gübre stok getirme hatası:", error);
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
    const updatedGubreStok = await GubreStok.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );
    if (!updatedGubreStok) {
      return NextResponse.json(
        { error: "Gübre stok bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedGubreStok);
  } catch (error) {
    console.error("Gübre stok güncelleme hatası:", error);
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
    const deletedGubreStok = await GubreStok.findByIdAndDelete(params.id);
    if (!deletedGubreStok) {
      return NextResponse.json(
        { error: "Gübre stok bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Gübre stok başarıyla silindi" });
  } catch (error) {
    console.error("Gübre stok silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
