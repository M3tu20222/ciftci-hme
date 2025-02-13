import mongoose, { type Document, Schema } from "mongoose";

export interface IGubre extends Document {
  ad: string;
  tip: string;
  birim: string;
  stok_miktari: number;
  fiyat: number;
  uretici: string;
  created_by: mongoose.Types.ObjectId;
}

const GubreSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    tip: { type: String, required: true },
    birim: { type: String, required: true },
    stok_miktari: { type: Number, required: true },
    fiyat: { type: Number, required: true },
    uretici: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Gubre ||
  mongoose.model<IGubre>("Gubre", GubreSchema);
