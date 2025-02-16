import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import SulamaKaydi from "@/models/SulamaKaydi";
import TarlaSahip from "@/models/TarlaSahip";
import KuyuFatura from "@/models/KuyuFatura";

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

    const sulamaKayitlari = (await SulamaKaydi.find({
      kuyu_id,
      baslangic_zamani: { $gte: new Date(baslangic) },
      bitis_zamani: { $lte: new Date(bitis) },
    })
      .populate("tarla_id", "ad")
      .populate("kuyu_id", "ad")
      .lean()) as SulamaKaydi[];

    const tarlaIds = [
      ...new Set(sulamaKayitlari.map((kayit) => kayit.tarla_id._id)),
    ];

    const tarlaSahipleri = await TarlaSahip.find({
      tarla_id: { $in: tarlaIds },
    })
      .populate("sahipler.sahip_id", "name")
      .populate("tarla_id", "ad")
      .lean();

    const kuyuFatura = (await KuyuFatura.findOne({
      kuyu_id,
      baslangic_tarihi: { $lte: new Date(bitis) },
      bitis_tarihi: { $gte: new Date(baslangic) },
    }).lean()) as { tutar: number } | null;

    const toplamSulamaSuresi = sulamaKayitlari.reduce(
      (total, kayit) => total + kayit.sulama_suresi,
      0
    );

    const birimMaliyet = kuyuFatura ? kuyuFatura.tutar / toplamSulamaSuresi : 0;

    const sahipAnalizi = new Map<
      string,
      {
        sahip: {
          _id: string;
          name: string;
        };
        toplamSure: number;
        toplamMaliyet: number;
        tarlalar: Set<string>;
      }
    >();

    sulamaKayitlari.forEach((kayit: SulamaKaydi) => {
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

            const sahipData = sahipAnalizi.get(sahipKey)!;
            sahipData.toplamSure += sulamaSuresi;
            sahipData.toplamMaliyet += sulamaSuresi * birimMaliyet;
            sahipData.tarlalar.add(kayit.tarla_id.ad);
          }
        );
      }
    });

    const sahipAnaliziArray = Array.from(sahipAnalizi.entries()).map(
      ([_, sahip]) => ({
        ...sahip,
        tarlalar: Array.from(sahip.tarlalar),
      })
    );

    return NextResponse.json({
      sulamaKayitlari,
      toplamSulamaSuresi,
      kuyuFatura,
      birimMaliyet,
      sahipAnalizi: sahipAnaliziArray,
    });
  } catch (error: any) {
    console.error("Sulama analizi hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
