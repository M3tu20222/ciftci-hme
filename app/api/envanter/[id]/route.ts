import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Envanter from "@/models/Envanter";
import dbConnect from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const envanterItem = await Envanter.findById(params.id).populate(
      "sahipler.sahip",
      "name"
    );
    if (!envanterItem) {
      return NextResponse.json(
        { error: "Envanter öğesi bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(envanterItem);
  } catch (error) {
    console.error("Envanter öğesi getirme hatası:", error);
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
    const updatedData = await request.json();
    const updatedEnvanterItem = await Envanter.findByIdAndUpdate(
      params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEnvanterItem) {
      return NextResponse.json(
        { error: "Envanter öğesi bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEnvanterItem);
  } catch (error) {
    console.error("Envanter öğesi güncelleme hatası:", error);
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
    const deletedEnvanterItem = await Envanter.findByIdAndDelete(params.id);

    if (!deletedEnvanterItem) {
      return NextResponse.json(
        { error: "Envanter öğesi bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Envanter öğesi başarıyla silindi" });
  } catch (error) {
    console.error("Envanter öğesi silme hatası:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
