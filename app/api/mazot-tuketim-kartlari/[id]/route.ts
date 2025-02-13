import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MazotTuketimKarti from "@/models/MazotTuketimKarti";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mazotTuketimKarti = await MazotTuketimKarti.findById(params.id);
    if (!mazotTuketimKarti) {
      return NextResponse.json(
        { error: "Mazot Tüketim Kartı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(mazotTuketimKarti);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const mazotTuketimKarti = await MazotTuketimKarti.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );
    if (!mazotTuketimKarti) {
      return NextResponse.json(
        { error: "Mazot Tüketim Kartı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(mazotTuketimKarti);
  } catch (error) {
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
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mazotTuketimKarti = await MazotTuketimKarti.findByIdAndDelete(
      params.id
    );
    if (!mazotTuketimKarti) {
      return NextResponse.json(
        { error: "Mazot Tüketim Kartı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Mazot Tüketim Kartı başarıyla silindi",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
