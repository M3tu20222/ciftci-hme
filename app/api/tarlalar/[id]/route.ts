import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Tarla from "@/models/Tarla";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const {
      ad,
      dekar,
      durum,
      sulanan,
      kiralik,
      ada_parsel,
      sezon_id,
      urun_id,
      kuyu_id,
    } = await request.json();

    const updatedTarla = await Tarla.findByIdAndUpdate(
      id,
      {
        ad,
        dekar,
        durum,
        sulanan,
        kiralik,
        ada_parsel,
        sezon_id,
        urun_id,
        kuyu_id,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTarla) {
      return new NextResponse("Tarla bulunamadı", { status: 404 });
    }

    return NextResponse.json(updatedTarla);
  } catch (error) {
    console.error("Tarla güncelleme hatası:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Bir hata oluştu",
      { status: 500 }
    );
  }
}
