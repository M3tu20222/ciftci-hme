import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    await dbConnect();

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json(
      { message: "Kullanıcı başarıyla oluşturuldu", userId: user._id },
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
