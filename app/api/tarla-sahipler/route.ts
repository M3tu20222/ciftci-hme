import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import TarlaSahip from "@/models/TarlaSahip";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const tarlaSahipler = await TarlaSahip.find({})
      .populate("tarla_id", "ad")
      .populate("sahipler.sahip_id", "name")
      .populate("created_by", "name");

    console.log(
      "Fetched tarlaSahipler:",
      JSON.stringify(tarlaSahipler, null, 2)
    );

    return NextResponse.json(tarlaSahipler);
  } catch (error) {
    console.error("Error fetching tarlaSahipler:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
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
    console.log("Alınan veri:", body); // Debugging için eklendi

    const { tarla_id, sahipler } = body;

    // Sahipler dizisinin doğru formatta olduğunu kontrol et
    if (!Array.isArray(sahipler) || sahipler.length === 0) {
      return NextResponse.json(
        { error: "Invalid sahipler data" },
        { status: 400 }
      );
    }

    const newTarlaSahip = new TarlaSahip({
      tarla_id,
      sahipler,
      created_by: session.user.id,
    });

    const savedTarlaSahip = await newTarlaSahip.save();
    return NextResponse.json(savedTarlaSahip, { status: 201 });
  } catch (error) {
    console.error("Tarla sahipleri ekleme hatası:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
