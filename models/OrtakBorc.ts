import mongoose, { Schema, type Document } from "mongoose";

export interface IOrtakBorc extends Document {
  odeme_kaydi_id: mongoose.Types.ObjectId;
  borclu_id: mongoose.Types.ObjectId;
  alacakli_id: mongoose.Types.ObjectId;
  borc_tutari: number;
  odeme_durumu: string;
  notlar: string;
  created_by: mongoose.Types.ObjectId;
  odeme_sekli?: string;
  odeme_tarihi?: Date;
  onaylandi: boolean;
}

const OrtakBorcSchema: Schema = new Schema(
  {
    odeme_kaydi_id: {
      type: Schema.Types.ObjectId,
      ref: "OdemeKaydi",
      required: true,
    },
    borclu_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    alacakli_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    borc_tutari: { type: Number, required: true },
    odeme_durumu: { type: String, required: true, default: "Ödenmedi" },
    notlar: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    odeme_sekli: { type: String, enum: ["Nakit", "EFT", "Havale"] },
    odeme_tarihi: { type: Date },
    onaylandi: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OrtakBorc =
  mongoose.models.OrtakBorc ||
  mongoose.model<IOrtakBorc>("OrtakBorc", OrtakBorcSchema);

export default OrtakBorc;
