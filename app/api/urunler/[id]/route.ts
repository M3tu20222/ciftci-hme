import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Urun from "@/models/Urun";
import dbConnect from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const urun = await Urun.findById(params.id).populate("sezon_id", "ad");
    if (!urun) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(urun);
  } catch (error) {
    console.error("Ürün getirme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { ad, kategori, marka, birim, sezon_id } = await request.json();
    const updatedUrun = await Urun.findByIdAndUpdate(
      params.id,
      { ad, kategori, marka, birim, sezon_id },
      { new: true, runValidators: true }
    );

    if (!updatedUrun) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedUrun);
  } catch (error) {
    console.error("Ürün güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const deletedUrun = await Urun.findByIdAndDelete(params.id);

    if (!deletedUrun) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    console.error("Ürün silme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
