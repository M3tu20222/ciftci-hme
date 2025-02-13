import mongoose, { Schema, type Document } from "mongoose";

export interface ITarlaIsleme extends Document {
  envanter_id: mongoose.Types.ObjectId;
  tarla_id: mongoose.Types.ObjectId;
  alan: number;
  tarih: Date;
  mazot_fiyati: number;
  toplam_mazot: number;
  maliyet: number;
  created_by: mongoose.Types.ObjectId;
}

const TarlaIslemeSchema: Schema = new Schema(
  {
    envanter_id: {
      type: Schema.Types.ObjectId,
      ref: "Envanter",
      required: true,
    },
    tarla_id: { type: Schema.Types.ObjectId, ref: "Tarla", required: true },
    alan: { type: Number, required: true },
    tarih: { type: Date, required: true },
    mazot_fiyati: { type: Number, required: true },
    toplam_mazot: { type: Number, required: true },
    maliyet: { type: Number, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.TarlaIsleme ||
  mongoose.model<ITarlaIsleme>("TarlaIsleme", TarlaIslemeSchema);
