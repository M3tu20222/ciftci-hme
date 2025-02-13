import mongoose, { type Document, Schema } from "mongoose";

export interface ISahip extends Document {
  ad: string;
  tip: string;
  created_by: mongoose.Types.ObjectId;
}

const SahipSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    tip: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "Sahip", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Sahip ||
  mongoose.model<ISahip>("Sahip", SahipSchema);
