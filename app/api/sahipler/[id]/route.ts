import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Sahip from "@/models/Sahip";
import dbConnect from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const sahip = await Sahip.findById(params.id);
    if (!sahip) {
      return NextResponse.json({ error: "Sahip bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(sahip);
  } catch (error) {
    console.error("Sahip getirme hatası:", error);
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
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { ad, tip } = await request.json();
    const updatedSahip = await Sahip.findByIdAndUpdate(
      params.id,
      { ad, tip },
      { new: true, runValidators: true }
    );

    if (!updatedSahip) {
      return NextResponse.json({ error: "Sahip bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedSahip);
  } catch (error) {
    console.error("Sahip güncelleme hatası:", error);
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
    const deletedSahip = await Sahip.findByIdAndDelete(params.id);

    if (!deletedSahip) {
      return NextResponse.json({ error: "Sahip bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sahip başarıyla silindi" });
  } catch (error) {
    console.error("Sahip silme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
