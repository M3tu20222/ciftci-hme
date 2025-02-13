import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import GubreStok from "@/models/GubreStok";
import dbConnect from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const gubreStok = await GubreStok.findById(params.id).populate("gubre");
    if (!gubreStok) {
      return NextResponse.json(
        { error: "Gübre stoku bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(gubreStok);
  } catch (error) {
    console.error("Gübre stoku getirme hatası:", error);
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
    const { gubre, miktar, birim, alisTarihi, sonKullanmaTarihi, fiyat } =
      await request.json();
    const updatedGubreStok = await GubreStok.findByIdAndUpdate(
      params.id,
      { gubre, miktar, birim, alisTarihi, sonKullanmaTarihi, fiyat },
      { new: true, runValidators: true }
    ).populate("gubre");

    if (!updatedGubreStok) {
      return NextResponse.json(
        { error: "Gübre stoku bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGubreStok);
  } catch (error) {
    console.error("Gübre stoku güncelleme hatası:", error);
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
        { error: "Gübre stoku bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Gübre stoku başarıyla silindi" });
  } catch (error) {
    console.error("Gübre stoku silme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
