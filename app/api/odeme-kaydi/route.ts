import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import OdemeKaydi from "@/models/OdemeKaydi";
import KuyuFatura from "@/models/KuyuFatura";
import OrtakBorc from "@/models/OrtakBorc";
import TarlaSahip from "@/models/TarlaSahip";
import { sendNotification } from "@/lib/notifications";
import { addMonths } from "date-fns"; // date-fns kütüphanesini eklemeyi unutmayın

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    const odemeTarihi = new Date(body.odeme_tarihi);
    const vadeTarihi = addMonths(odemeTarihi, body.erteleme_suresi);

    const yeniOdemeKaydi = new OdemeKaydi({
      ...body,
      vade_tarihi: vadeTarihi,
      created_by: session.user.id,
    });
    await yeniOdemeKaydi.save();

    // Kuyu faturasını güncelle
    await KuyuFatura.findByIdAndUpdate(body.kuyu_fatura_id, {
      odeme_durumu: "Ödendi",
    });

    // Ortak borçları hesapla ve kaydet
    const tarlaSahipleri = await TarlaSahip.find({ tarla_id: body.tarla_id });
    const toplamPay = tarlaSahipleri.reduce(
      (sum, sahip) => sum + sahip.yuzde,
      0
    );

    for (const sahip of tarlaSahipleri) {
      if (sahip.sahip_id.toString() !== body.odeme_yapan_id) {
        const borcTutari = (body.odeme_tutari * sahip.yuzde) / toplamPay;
        const yeniOrtakBorc = new OrtakBorc({
          odeme_kaydi_id: yeniOdemeKaydi._id,
          borclu_id: sahip.sahip_id,
          alacakli_id: body.odeme_yapan_id,
          borc_tutari: borcTutari,
          vade_tarihi: vadeTarihi, // Ortak borçlara da vade tarihi ekliyoruz
          created_by: session.user.id,
        });
        await yeniOrtakBorc.save();

        await sendNotification({
          userId: yeniOrtakBorc.borclu_id.toString(),
          title: "Yeni Borç Kaydı",
          message: `${session.user.name} tarafından ${
            yeniOrtakBorc.borc_tutari
          } TL tutarında bir borç kaydedildi. Vade tarihi: ${vadeTarihi.toLocaleDateString()}.`,
          type: "info",
        });
      }
    }

    return NextResponse.json(yeniOdemeKaydi, { status: 201 });
  } catch (error: any) {
    console.error("Ödeme kaydı ekleme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}

// GET ve diğer metodlar aynı kalabilir...
