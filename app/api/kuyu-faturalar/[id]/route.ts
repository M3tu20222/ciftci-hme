import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import KuyuFatura from "@/models/KuyuFatura";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const kuyuFatura = await KuyuFatura.findById(params.id).populate(
      "kuyu_id",
      "ad"
    );
    if (!kuyuFatura) {
      return NextResponse.json(
        { error: "Kuyu faturası bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(kuyuFatura);
  } catch (error) {
    console.error("Kuyu faturası getirme hatası:", error);
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
    const { kuyu_id, baslangic_tarihi, bitis_tarihi, tutar, odendi } =
      await request.json();
    const updatedKuyuFatura = await KuyuFatura.findByIdAndUpdate(
      params.id,
      { kuyu_id, baslangic_tarihi, bitis_tarihi, tutar, odendi },
      { new: true, runValidators: true }
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
