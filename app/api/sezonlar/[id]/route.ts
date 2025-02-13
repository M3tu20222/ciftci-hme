import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Sezon from "@/models/Sezon";
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
    const { ad, baslangic_tarihi, bitis_tarihi } = await request.json();
    const updatedSezon = await Sezon.findByIdAndUpdate(
      params.id,
      { ad, baslangic_tarihi, bitis_tarihi },
      { new: true, runValidators: true }
    );

    if (!updatedSezon) {
      return NextResponse.json({ error: "Sezon bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedSezon);
  } catch (error) {
    console.error("Sezon güncelleme hatası:", error);
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
    const deletedSezon = await Sezon.findByIdAndDelete(params.id);

    if (!deletedSezon) {
      return NextResponse.json({ error: "Sezon bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sezon başarıyla silindi" });
  } catch (error) {
    console.error("Sezon silme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
