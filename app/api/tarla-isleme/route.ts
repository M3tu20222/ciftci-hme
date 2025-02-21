import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import TarlaIsleme from "@/models/TarlaIsleme";
import Tarla from "@/models/Tarla";
import Envanter from "@/models/Envanter";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const query: any = {};
  if (startDate && endDate) {
    query.islem_tarihi = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  try {
    const total = await TarlaIsleme.countDocuments(query);
    const tarlaIslemeleri = await TarlaIsleme.find(query)
      .sort({ islem_tarihi: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("tarla_id", "ad dekar") // Include dekar for frontend calculations
      .populate("ekipman", "ad yakitTuketimi") // Include yakitTuketimi
      .populate("created_by", "name");

    return NextResponse.json({
      tarlaIslemeleri,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error: any) {
    console.error("Tarla işlemeleri getirme hatası:", error);
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
    const tarla = await Tarla.findById(body.tarla_id);
    const ekipman = await Envanter.findById(body.ekipman);

    if (!tarla || !ekipman) {
      return NextResponse.json(
        { error: "Geçersiz tarla veya ekipman" },
        { status: 400 }
      );
    }

    const yakit_tuketimi = tarla.dekar * ekipman.yakitTuketimi;

    const yeniTarlaIsleme = new TarlaIsleme({
      tarla_id: body.tarla_id,
      islem_tarihi: body.islem_tarihi,
      ekipman: body.ekipman,
      yakit_tuketimi,
      maliyet: body.maliyet,
      notlar: body.notlar,
      created_by: session.user.id,
    });
    await yeniTarlaIsleme.save();
    return NextResponse.json(yeniTarlaIsleme, { status: 201 });
  } catch (error: any) {
    console.error("Tarla işleme ekleme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
