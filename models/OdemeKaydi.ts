import mongoose, { Schema, type Document } from "mongoose";

export interface IOdemeKaydi extends Document {
  kuyu_fatura_id: mongoose.Types.ObjectId;
  odeme_yapan_id: mongoose.Types.ObjectId;
  odeme_tarihi: Date;
  vade_tarihi: Date; // Yeni eklenen alan
  odeme_tutari: number;
  odeme_yontemi: string;
  erteleme_suresi: number;
  notlar: string;
  created_by: mongoose.Types.ObjectId;
}

const OdemeKaydiSchema: Schema = new Schema(
  {
    kuyu_fatura_id: {
      type: Schema.Types.ObjectId,
      ref: "KuyuFatura",
      required: true,
    },
    odeme_yapan_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    odeme_tarihi: { type: Date, required: true },
    vade_tarihi: { type: Date, required: true }, // Yeni eklenen alan
    odeme_tutari: { type: Number, required: true },
    odeme_yontemi: { type: String, required: true },
    erteleme_suresi: { type: Number, default: 0 },
    notlar: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const OdemeKaydi =
  mongoose.models.OdemeKaydi ||
  mongoose.model<IOdemeKaydi>("OdemeKaydi", OdemeKaydiSchema);

export default OdemeKaydi;
