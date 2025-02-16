import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import SulamaKaydi from "@/models/SulamaKaydi";
import Kuyu from "@/models/Kuyu";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const sulamaKayitlari = await SulamaKaydi.find({})
      .populate("tarla_id", "ad")
      .populate("kuyu_id", "ad")
      .populate("sezon_id", "ad")
      .populate("created_by", "name")
      .sort({ baslangic_zamani: -1 });

    return NextResponse.json(sulamaKayitlari);
  } catch (error: any) {
    console.error("Sulama kayıtlarını getirme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    // Kuyu'dan sezon bilgisini al
    const kuyu = await Kuyu.findById(body.kuyu_id);
    if (!kuyu) {
      return NextResponse.json({ error: "Kuyu bulunamadı" }, { status: 404 });
    }

    const yeniSulamaKaydi = new SulamaKaydi({
      ...body,
      bitis_zamani,
      sezon_id: kuyu.sezon_id, // Kuyu'dan alınan sezon bilgisi
      created_by: session.user.id,
    });
    await yeniSulamaKaydi.save();
    return NextResponse.json(yeniSulamaKaydi, { status: 201 });
  } catch (error: any) {
    console.error("Sulama kaydı ekleme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    // Kuyu'dan sezon bilgisini al
    const kuyu = await Kuyu.findById(body.kuyu_id);
    if (!kuyu) {
      return NextResponse.json({ error: "Kuyu bulunamadı" }, { status: 404 });
    }

    const updatedSulamaKaydi = await SulamaKaydi.findByIdAndUpdate(
      body._id,
      { ...body, bitis_zamani, sezon_id: kuyu.sezon_id },
      { new: true }
    );
    return NextResponse.json(updatedSulamaKaydi);
  } catch (error: any) {
    console.error("Sulama kaydı güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
