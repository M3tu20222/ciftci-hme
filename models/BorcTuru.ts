import mongoose, { Schema, type Document } from "mongoose";

export interface IBorcTuru extends Document {
  ad: string;
  aciklama: string;
  aktif: boolean;
  created_by: mongoose.Types.ObjectId;
}

const BorcTuruSchema: Schema = new Schema(
  {
    ad: { type: String, required: true, unique: true },
    aciklama: { type: String },
    aktif: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const BorcTuru =
  mongoose.models.BorcTuru ||
  mongoose.model<IBorcTuru>("BorcTuru", BorcTuruSchema);

export default BorcTuru;
