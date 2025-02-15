import mongoose, { type Document, Schema } from "mongoose";

export interface ISahiplik {
  sahip_id: mongoose.Types.ObjectId;
  yuzde: number;
}

export interface IEnvanter extends Document {
  ad: string;
  kategori_id: mongoose.Types.ObjectId;
  miktar: number;
  birim: string;
  deger: number;
  sahiplikler: ISahiplik[];
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
    sahiplikler: [
      {
        _id: false,
        sahip_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        yuzde: { type: Number, required: true, min: 0, max: 100 },
      },
    ],
  },
  { timestamps: true }
);

const Envanter =
  mongoose.models.Envanter ||
  mongoose.model<IEnvanter>("Envanter", EnvanterSchema);

export default Envanter;
