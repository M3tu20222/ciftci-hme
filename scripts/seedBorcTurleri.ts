import mongoose from "mongoose";
require("dotenv").config();

const BorcTuruSchema = new mongoose.Schema(
  {
    ad: { type: String, required: true, unique: true },
    aciklama: { type: String },
    aktif: { type: Boolean, default: true },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const BorcTuru =
  mongoose.models.BorcTuru || mongoose.model("BorcTuru", BorcTuruSchema);

const borcTurleri = [
  {
    ad: "Sulama Borcu",
    aciklama: "Sulama işlemleri için oluşan borç",
    aktif: true,
    created_by: new mongoose.Types.ObjectId("67aa1ed24dde8e1cdb305300"), // Admin user ID
  },
  {
    ad: "Gübre Borcu",
    aciklama: "Gübre alımı için oluşan borç",
    aktif: true,
    created_by: new mongoose.Types.ObjectId("67aa1ed24dde8e1cdb305300"),
  },
  {
    ad: "Tohum Borcu",
    aciklama: "Tohum alımı için oluşan borç",
    aktif: true,
    created_by: new mongoose.Types.ObjectId("67aa1ed24dde8e1cdb305300"),
  },
  {
    ad: "İşçilik Borcu",
    aciklama: "Tarla işçiliği için oluşan borç",
    aktif: true,
    created_by: new mongoose.Types.ObjectId("67aa1ed24dde8e1cdb305300"),
  },
  {
    ad: "Ekipman Kirası",
    aciklama: "Tarım ekipmanları kirası için oluşan borç",
    aktif: true,
    created_by: new mongoose.Types.ObjectId("67aa1ed24dde8e1cdb305300"),
  },
];

async function seedBorcTurleri() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Veritabanına bağlanıldı.");

    // Clear existing records
    await BorcTuru.deleteMany({});
    console.log("Mevcut borç türleri temizlendi.");

    // Insert new records
    const result = await BorcTuru.insertMany(borcTurleri);
    console.log(`${result.length} borç türü başarıyla eklendi:`);
    result.forEach((borcTuru: any) => {
      console.log(`- ${borcTuru.ad}`);
    });
  } catch (error) {
    console.error("Hata oluştu:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Veritabanı bağlantısı kapatıldı.");
    process.exit(0);
  }
}

seedBorcTurleri();
