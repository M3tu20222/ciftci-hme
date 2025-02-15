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
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Changed from Sahip to User
  },
  {
    timestamps: true,
  }
);

const Urun = mongoose.models.Urun || mongoose.model<IUrun>("Urun", UrunSchema);

export default Urun;
