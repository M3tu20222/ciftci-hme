import mongoose, { type Document, Schema } from "mongoose";

export interface IEnvanter extends Document {
  ad: string;
  kategori: string;
  altKategori: string;
  miktar: number;
  birim: string;
  mevcutDeger: number;
  yakitTuketimi: number;
  sahipler: Array<{ sahip: mongoose.Types.ObjectId; oran: number }>;
  created_by: mongoose.Types.ObjectId;
}

const EnvanterSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    kategori: { type: String, required: true },
    altKategori: { type: String, required: true },
    miktar: { type: Number, required: true },
    birim: { type: String, required: true },
    mevcutDeger: { type: Number, required: true },
    yakitTuketimi: { type: Number, default: 0 },
    sahipler: [
      {
        sahip: { type: Schema.Types.ObjectId, ref: "User", required: true },
        oran: { type: Number, required: true },
      },
    ],
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Envanter ||
  mongoose.model<IEnvanter>("Envanter", EnvanterSchema);
