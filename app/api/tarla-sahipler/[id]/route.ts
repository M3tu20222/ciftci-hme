import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TarlaSahip from "@/models/TarlaSahip";
import dbConnect from "@/lib/mongodb";

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
    const tarlaSahip = await TarlaSahip.findById(params.id).populate(
      "tarla_id sahip_id"
    );
    if (!tarlaSahip) {
      return NextResponse.json(
        { error: "Tarla sahip ilişkisi bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(tarlaSahip);
  } catch (error) {
    console.error("Tarla sahip ilişkisi getirme hatası:", error);
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
    const updatedTarlaSahip = await TarlaSahip.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );
    if (!updatedTarlaSahip) {
      return NextResponse.json(
        { error: "Tarla sahip ilişkisi bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedTarlaSahip);
  } catch (error) {
    console.error("Tarla sahip ilişkisi güncelleme hatası:", error);
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
    const deletedTarlaSahip = await TarlaSahip.findByIdAndDelete(params.id);
    if (!deletedTarlaSahip) {
      return NextResponse.json(
        { error: "Tarla sahip ilişkisi bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Tarla sahip ilişkisi başarıyla silindi",
    });
  } catch (error) {
    console.error("Tarla sahip ilişkisi silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
