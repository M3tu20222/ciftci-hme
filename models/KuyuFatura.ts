import mongoose, { Schema, type Document } from "mongoose";

export interface IKuyuFatura extends Document {
  kuyu_id: mongoose.Types.ObjectId;
  baslangic_tarihi: Date;
  bitis_tarihi: Date;
  tutar: number;
  odendi: boolean;
  created_by: mongoose.Types.ObjectId;
  son_odeme_tarihi: Date;
  odeme_durumu: string;
}

const KuyuFaturaSchema: Schema = new Schema(
  {
    kuyu_id: { type: Schema.Types.ObjectId, ref: "Kuyu", required: true },
    baslangic_tarihi: { type: Date, required: true },
    bitis_tarihi: { type: Date, required: true },
    tutar: { type: Number, required: true },
    odendi: { type: Boolean, default: false },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    son_odeme_tarihi: { type: Date, required: true },
    odeme_durumu: { type: String, required: true, default: "Ödenmedi" },
  },
  { timestamps: true }
);

const KuyuFatura =
  mongoose.models.KuyuFatura ||
  mongoose.model<IKuyuFatura>("KuyuFatura", KuyuFaturaSchema);

export default KuyuFatura;
