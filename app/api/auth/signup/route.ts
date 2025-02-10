import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // E-posta adresinin kullanılıp kullanılmadığını kontrol et
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcıyı veritabanına ekle
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role, // Kullanıcının seçtiği rol
    });

    return NextResponse.json(
      { message: "Kullanıcı başarıyla oluşturuldu", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
