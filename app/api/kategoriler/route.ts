import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Kategori, { type IKategori } from "@/models/Kategori";

interface KategoriWithChildren extends Omit<IKategori, "_id"> {
  _id: string;
  altKategoriler: KategoriWithChildren[];
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const kategoriler = await Kategori.find({}).lean();
    const kategoriMap = new Map<string, KategoriWithChildren>();

    kategoriler.forEach((k) => {
      const kategori = k as unknown as KategoriWithChildren;
      kategoriMap.set(kategori._id.toString(), {
        ...kategori,
        _id: kategori._id.toString(),
        altKategoriler: [],
      });
    });

    kategoriler.forEach((kategori) => {
      const kat = kategori as unknown as KategoriWithChildren;
      if (kat.ust_kategori_id) {
        const ustKategori = kategoriMap.get(kat.ust_kategori_id.toString());
        if (ustKategori) {
          ustKategori.altKategoriler.push(
            kategoriMap.get(kat._id.toString()) as KategoriWithChildren
          );
        }
      }
    });

    const rootKategoriler = Array.from(kategoriMap.values()).filter(
      (k) => !k.ust_kategori_id
    );

    return NextResponse.json(rootKategoriler);
  } catch (error) {
    console.error("Kategorileri getirme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
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
    if (body.ust_kategori_id === "0" || body.ust_kategori_id === null) {
      delete body.ust_kategori_id;
    }
    const yeniKategori = new Kategori(body);
    await yeniKategori.save();
    return NextResponse.json(yeniKategori, { status: 201 });
  } catch (error) {
    console.error("Kategori ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
