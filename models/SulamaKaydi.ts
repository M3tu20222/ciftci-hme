import mongoose, { type Document, Schema } from "mongoose";

export interface ISulamaKaydi extends Document {
  tarla_id: mongoose.Types.ObjectId;
  kuyu_id: mongoose.Types.ObjectId;
  sezon_id: mongoose.Types.ObjectId; // Yeni eklenen alan
  baslangic_zamani: Date;
  bitis_zamani: Date;
  sulama_suresi: number; // in minutes
  notlar: string;
  created_by: mongoose.Types.ObjectId;
}

const SulamaKaydiSchema: Schema = new Schema(
  {
    tarla_id: { type: Schema.Types.ObjectId, ref: "Tarla", required: true },
    kuyu_id: { type: Schema.Types.ObjectId, ref: "Kuyu", required: true },
    sezon_id: { type: Schema.Types.ObjectId, ref: "Sezon", required: true }, // Kuyudan otomatik olarak alınacak
    baslangic_zamani: { type: Date, required: true },
    bitis_zamani: { type: Date, required: true },
    sulama_suresi: { type: Number, required: true },
    notlar: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const SulamaKaydi =
  mongoose.models.SulamaKaydi ||
  mongoose.model<ISulamaKaydi>("SulamaKaydi", SulamaKaydiSchema);

export default SulamaKaydi;
