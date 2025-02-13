import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Kuyu from "@/models/Kuyu";
import dbConnect from "@/lib/mongodb";

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
    const { ad, bolge, konum, derinlik, kapasite, durum, sezon_id } =
      await request.json();
    const updatedKuyu = await Kuyu.findByIdAndUpdate(
      params.id,
      { ad, bolge, konum, derinlik, kapasite, durum, sezon_id },
      { new: true, runValidators: true }
    );

    if (!updatedKuyu) {
      return NextResponse.json({ error: "Kuyu bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedKuyu);
  } catch (error) {
    console.error("Kuyu güncelleme hatası:", error);
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
    const deletedKuyu = await Kuyu.findByIdAndDelete(params.id);

    if (!deletedKuyu) {
      return NextResponse.json({ error: "Kuyu bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Kuyu başarıyla silindi" });
  } catch (error) {
    console.error("Kuyu silme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
