import mongoose, { type Document, Schema } from "mongoose";
import "./Sezon"; // Ensure Sezon model is registered
import "./Urun"; // Ensure Urun model is registered
import "./Kuyu"; // Ensure Kuyu model is registered

export interface ITarla extends Document {
  ad: string;
  dekar: number;
  durum: string;
  sulanan: boolean;
  kiralik: boolean;
  ada_parsel: string;
  sezon_id: mongoose.Types.ObjectId;
  urun_id: mongoose.Types.ObjectId;
  kuyu_id?: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
}

const TarlaSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    dekar: { type: Number, required: true },
    durum: { type: String, required: true },
    sulanan: { type: Boolean, required: true },
    kiralik: { type: Boolean, required: true },
    ada_parsel: { type: String, required: true },
    sezon_id: { type: Schema.Types.ObjectId, ref: "Sezon", required: true },
    urun_id: { type: Schema.Types.ObjectId, ref: "Urun", required: true },
    kuyu_id: { type: Schema.Types.ObjectId, ref: "Kuyu", required: false },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Tarla =
  mongoose.models.Tarla || mongoose.model<ITarla>("Tarla", TarlaSchema);

export default Tarla;
