import mongoose, { type Document, Schema } from "mongoose";

export interface IEnvanter extends Document {
  ad: string;
  kategori_id: mongoose.Types.ObjectId;
  miktar: number;
  birim: string;
  deger: number;
}

const EnvanterSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    kategori_id: {
      type: Schema.Types.ObjectId,
      ref: "Kategori",
      required: true,
    },
    miktar: { type: Number, required: true },
    birim: { type: String, required: true },
    deger: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Envanter ||
  mongoose.model<IEnvanter>("Envanter", EnvanterSchema);
