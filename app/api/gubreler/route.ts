import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import GubreStok from "@/models/GubreStok";
import dbConnect from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const gubreStok = await GubreStok.findById(params.id).populate(
      "gubre_id",
      "ad"
    );
    if (!gubreStok) {
      return NextResponse.json(
        { error: "Gübre stok bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(gubreStok);
  } catch (error) {
    console.error("Gübre stok getirme hatası:", error);
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
    const {
      gubre_id,
      miktar,
      alim_tarihi,
      son_kullanma_tarihi,
      fiyat,
      tedarikci,
    } = await request.json();
    const updatedGubreStok = await GubreStok.findByIdAndUpdate(
      params.id,
      { gubre_id, miktar, alim_tarihi, son_kullanma_tarihi, fiyat, tedarikci },
      { new: true, runValidators: true }
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
