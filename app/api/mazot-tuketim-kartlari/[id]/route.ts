import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MazotTuketimKarti from "@/models/MazotTuketimKarti";
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
    const mazotTuketimKarti = await MazotTuketimKarti.findById(
      params.id
    ).populate("tarla_id");
    if (!mazotTuketimKarti) {
      return NextResponse.json(
        { error: "Mazot tüketim kartı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(mazotTuketimKarti);
  } catch (error) {
    console.error("Mazot tüketim kartı getirme hatası:", error);
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
    const updatedMazotTuketimKarti = await MazotTuketimKarti.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );
    if (!updatedMazotTuketimKarti) {
      return NextResponse.json(
        { error: "Mazot tüketim kartı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedMazotTuketimKarti);
  } catch (error) {
    console.error("Mazot tüketim kartı güncelleme hatası:", error);
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
    const deletedMazotTuketimKarti = await MazotTuketimKarti.findByIdAndDelete(
      params.id
    );
    if (!deletedMazotTuketimKarti) {
      return NextResponse.json(
        { error: "Mazot tüketim kartı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Mazot tüketim kartı başarıyla silindi",
    });
  } catch (error) {
    console.error("Mazot tüketim kartı silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
