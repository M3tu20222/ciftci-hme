import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import SulamaKaydi from "@/models/SulamaKaydi";
import TarlaSahip from "@/models/TarlaSahip";
import KuyuFatura from "@/models/KuyuFatura";
import Tarla from "@/models/Tarla";

interface SulamaKaydi {
  _id: unknown;
  tarla_id: {
    _id: string;
    ad: string;
  };
  sulama_suresi: number;
  kuyu_id: {
    _id: string;
    ad: string;
  };
  baslangic_zamani: Date;
  bitis_zamani: Date;
}

interface TarlaSahiplik {
  tarla_id: {
    _id: string;
    ad: string;
  };
  sahipler: Array<{
    sahip_id: {
      _id: string;
      name: string;
    };
    yuzde: number;
  }>;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const baslangic = searchParams.get("baslangic");
    const bitis = searchParams.get("bitis");
    const kuyu_id = searchParams.get("kuyu_id");

    if (!baslangic || !bitis || !kuyu_id) {
      return NextResponse.json(
        { error: "Gerekli parametreler eksik" },
        { status: 400 }
      );
    }

    let sulamaKayitlari;
    if (kuyu_id === "total") {
      sulamaKayitlari = await SulamaKaydi.find({
        baslangic_zamani: { $gte: new Date(baslangic) },
        bitis_zamani: { $lte: new Date(bitis) },
      })
        .populate("tarla_id", "ad")
        .populate("kuyu_id", "ad")
        .lean();
    } else {
      sulamaKayitlari = await SulamaKaydi.find({
        kuyu_id,
        baslangic_zamani: { $gte: new Date(baslangic) },
        bitis_zamani: { $lte: new Date(bitis) },
      })
        .populate("tarla_id", "ad")
        .populate("kuyu_id", "ad")
        .lean();
    }

    const tarlaIds = [
      ...new Set(sulamaKayitlari.map((kayit) => kayit.tarla_id._id)),
    ];

    const tarlaSahipleri = (await TarlaSahip.find({
      tarla_id: { $in: tarlaIds },
    })
      .populate("sahipler.sahip_id", "name")
      .populate("tarla_id", "ad")
      .lean()) as TarlaSahiplik[];

    let kuyuFatura;
    if (kuyu_id === "total") {
      kuyuFatura = await KuyuFatura.find({
        baslangic_tarihi: { $lte: new Date(bitis) },
        bitis_tarihi: { $gte: new Date(baslangic) },
      }).lean();
    } else {
      kuyuFatura = await KuyuFatura.findOne({
        kuyu_id,
        baslangic_tarihi: { $lte: new Date(bitis) },
        bitis_tarihi: { $gte: new Date(baslangic) },
      }).lean();
    }

    const toplamSulamaSuresi = sulamaKayitlari.reduce(
      (total, kayit) => total + kayit.sulama_suresi,
      0
    );

    const toplamFaturaTutari = Array.isArray(kuyuFatura)
      ? kuyuFatura.reduce((total, fatura) => total + fatura.tutar, 0)
      : kuyuFatura?.tutar || 0;

    let toplamFaturaDegeri = 0;
    if (kuyu_id === "total") {
      const tumKuyuFaturalar = await KuyuFatura.find({
        baslangic_tarihi: { $lte: new Date(bitis) },
        bitis_tarihi: { $gte: new Date(baslangic) },
      }).lean();
      toplamFaturaDegeri = tumKuyuFaturalar.reduce(
        (total, fatura) => total + fatura.tutar,
        0
      );
    } else {
      toplamFaturaDegeri = toplamFaturaTutari;
    }

    const birimMaliyet = toplamFaturaTutari / toplamSulamaSuresi;

    const sahipAnalizi = new Map();

    sulamaKayitlari.forEach((kayit: any) => {
      const tarlaSahiplik = tarlaSahipleri.find(
        (ts) => ts.tarla_id._id.toString() === kayit.tarla_id._id.toString()
      );

      if (tarlaSahiplik) {
        tarlaSahiplik.sahipler.forEach(
          (sahip: {
            sahip_id: { _id: string; name: string };
            yuzde: number;
          }) => {
            const sahipKey = sahip.sahip_id._id.toString();
            const sulamaSuresi = (kayit.sulama_suresi * sahip.yuzde) / 100;

            if (!sahipAnalizi.has(sahipKey)) {
              sahipAnalizi.set(sahipKey, {
                sahip: {
                  _id: sahip.sahip_id._id,
                  name: sahip.sahip_id.name,
                },
                toplamSure: 0,
                toplamMaliyet: 0,
                tarlalar: new Set(),
              });
            }

            const sahipData = sahipAnalizi.get(sahipKey);
            sahipData.toplamSure += sulamaSuresi;
            sahipData.toplamMaliyet += sulamaSuresi * birimMaliyet;
            sahipData.tarlalar.add(kayit.tarla_id.ad);
          }
        );
      }
    });

    const sahipAnaliziArray = Array.from(sahipAnalizi.values()).map(
      (sahip) => ({
        ...sahip,
        tarlalar: Array.from(sahip.tarlalar),
      })
    );

    // Ensure Tarla model is used somewhere to trigger its registration
    await Tarla.findOne();

    return NextResponse.json({
      sulamaKayitlari,
      toplamSulamaSuresi,
      kuyuFatura: { tutar: toplamFaturaTutari },
      birimMaliyet,
      sahipAnalizi: sahipAnaliziArray,
      toplamFaturaDegeri,
    });
  } catch (error: any) {
    console.error("Sulama analizi hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
