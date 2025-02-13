import mongoose, { Schema, type Document } from "mongoose";

export interface IMazotTuketimKarti extends Document {
  tarih: Date;
  aracPlakasi: string;
  surucu: string;
  yakitMiktari: number;
  birimFiyat: number;
  toplamTutar: number;
  aciklama?: string;
  ad: string;
  kategori: string;
  alt_kategori: string;
  dekar_basi_mazot_tuketim: number;
  created_by: number;
}

const MazotTuketimKartiSchema: Schema = new Schema(
  {
    tarih: { type: Date, required: true },
    aracPlakasi: { type: String, required: true },
    surucu: { type: String, required: true },
    yakitMiktari: { type: Number, required: true },
    birimFiyat: { type: Number, required: true },
    toplamTutar: { type: Number, required: true },
    aciklama: { type: String },
    ad: { type: String, required: true },
    kategori: { type: String, required: true },
    alt_kategori: { type: String, required: true },
    dekar_basi_mazot_tuketim: { type: Number, required: true },
    created_by: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.MazotTuketimKarti ||
  mongoose.model<IMazotTuketimKarti>(
    "MazotTuketimKarti",
    MazotTuketimKartiSchema
  );
