import mongoose, { Schema, type Document } from "mongoose";

export interface ITarlaIsleme extends Document {
  tarla_id: mongoose.Types.ObjectId;
  islem_tarihi: Date;
  ekipman: mongoose.Types.ObjectId;
  yakit_tuketimi: number;
  maliyet?: number;
  notlar?: string;
  created_by: mongoose.Types.ObjectId;
}

const TarlaIslemeSchema: Schema = new Schema(
  {
    tarla_id: { type: Schema.Types.ObjectId, ref: "Tarla", required: true },
    islem_tarihi: { type: Date, required: true },
    ekipman: { type: Schema.Types.ObjectId, ref: "Envanter", required: true },
    yakit_tuketimi: { type: Number, required: true },
    maliyet: { type: Number },
    notlar: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const TarlaIsleme =
  mongoose.models.TarlaIsleme ||
  mongoose.model<ITarlaIsleme>("TarlaIsleme", TarlaIslemeSchema);

export default TarlaIsleme;
