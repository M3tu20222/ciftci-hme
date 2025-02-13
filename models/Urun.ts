import mongoose, { type Document, Schema } from "mongoose";

export interface IUrun extends Document {
  ad: string;
  kategori: string;
  marka: string;
  birim: string;
  sezon_id: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
}

const UrunSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    kategori: { type: String, required: true },
    marka: { type: String, required: true },
    birim: { type: String, required: true },
    sezon_id: { type: Schema.Types.ObjectId, ref: "Sezon", required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "Sahip", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Urun ||
  mongoose.model<IUrun>("Urun", UrunSchema);
