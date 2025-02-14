import mongoose, { type Document, Schema } from "mongoose";

export interface ISahip extends Document {
  ad: string;
  tip: string;
  user_id: mongoose.Types.ObjectId;
}

const SahipSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    tip: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Sahip ||
  mongoose.model<ISahip>("Sahip", SahipSchema);
