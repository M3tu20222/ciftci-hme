import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import OrtakBorc from "@/models/OrtakBorc";
import { sendNotification } from "@/lib/notifications";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let query = {};
    if (userId) {
      query = { $or: [{ borclu_id: userId }, { alacakli_id: userId }] };
    }

    const ortakBorclar = await OrtakBorc.find(query)
      .populate("odeme_kaydi_id", "odeme_tarihi odeme_tutari")
      .populate("borclu_id", "name")
      .populate("alacakli_id", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(ortakBorclar);
  } catch (error: any) {
    console.error("Ortak borçları getirme hatası:", error);
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
    const { id, odeme_durumu, odeme_sekli, notlar, onaylandi } = body;

    const guncellenenBorc = await OrtakBorc.findByIdAndUpdate(
      id,
      {
        odeme_durumu,
        odeme_sekli,
        notlar,
        onaylandi,
        ...(odeme_durumu === "Ödendi" ? { odeme_tarihi: new Date() } : {}),
      },
      { new: true }
    )
      .populate("borclu_id", "name")
      .populate("alacakli_id", "name");

    if (!guncellenenBorc) {
      return NextResponse.json({ error: "Borç bulunamadı" }, { status: 404 });
    }

    if (odeme_durumu === "Ödendi" && !onaylandi) {
      await sendNotification({
        title: "Borç ödeme onayı bekliyor",
        message: `${
          guncellenenBorc.borclu_id.name || "Kullanıcı"
        } borcunu ödedi. Lütfen onaylayın.`,
        userId: guncellenenBorc.alacakli_id.toString(),
        type: "info",
      });
    } else if (odeme_durumu === "Ödendi" && onaylandi) {
      await sendNotification({
        title: "Borç ödemeniz onaylandı",
        message: `${
          guncellenenBorc.alacakli_id.name || "Alacaklı"
        } borç ödemenizi onayladı.`,
        userId: guncellenenBorc.borclu_id.toString(),
        type: "success",
      });
    }

    return NextResponse.json(guncellenenBorc);
  } catch (error: any) {
    console.error("Ortak borç güncelleme hatası:", error);
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
    const yeniOrtakBorc = new OrtakBorc({
      ...body,
      borc_tutari: Math.ceil(body.borc_tutari), // Yukarı yuvarlama
      created_by: session.user.id,
    });
    await yeniOrtakBorc.save();

    await sendNotification({
      userId: yeniOrtakBorc.borclu_id.toString(),
      title: "Yeni borç kaydı",
      message: `${yeniOrtakBorc.alacakli_id.name} size ${yeniOrtakBorc.borc_tutari} TL tutarında bir borç kaydetti.`,
      type: "info",
    });

    return NextResponse.json(yeniOrtakBorc, { status: 201 });
  } catch (error: any) {
    console.error("Ortak borç ekleme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
