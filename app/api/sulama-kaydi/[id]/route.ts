import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import SulamaKaydi from "@/models/SulamaKaydi";

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
    const kayit = await SulamaKaydi.findById(params.id)
      .populate("tarla_id", "ad")
      .populate("kuyu_id", "ad")
      .populate("sezon_id", "ad")
      .populate("created_by", "name");
      
    if (!kayit) {
      return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(kayit);
  } catch (error) {
    console.error("Sulama kaydı getirme hatası:", error);
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
    const baslangic_zamani = new Date(body.baslangic_zamani);
    const bitis_zamani = new Date(
      baslangic_zamani.getTime() + body.sulama_suresi * 60000
    );

    const updatedKayit = await SulamaKaydi.findByIdAndUpdate(
      params.id,
      { ...body, bitis_zamani },
      { new: true }
    )
      .populate("tarla_id", "ad")
      .populate("kuyu_id", "ad")
      .populate("sezon_id", "ad")
      .populate("created_by", "name");

    if (!updatedKayit) {
      return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedKayit);
  } catch (error) {
    console.error("Sulama kaydı güncelleme hatası:", error);
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
    const deletedKayit = await SulamaKaydi.findByIdAndDelete(params.id);

    if (!deletedKayit) {
      return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Kayıt başarıyla silindi" });
  } catch (error) {
    console.error("Sulama kaydı silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
