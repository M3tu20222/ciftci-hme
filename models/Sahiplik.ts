import mongoose, { type Document, Schema } from "mongoose";

export interface ISahiplik extends Document {
  envanter_id: mongoose.Types.ObjectId;
  sahip_id: mongoose.Types.ObjectId;
  sahiplik_turu: string;
  yuzde: number;
}

const SahiplikSchema: Schema = new Schema(
  {
    envanter_id: {
      type: Schema.Types.ObjectId,
      ref: "Envanter",
      required: true,
    },
    sahip_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sahiplik_turu: { type: String, required: true },
    yuzde: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

export default mongoose.models.Sahiplik ||
  mongoose.model<ISahiplik>("Sahiplik", SahiplikSchema);
