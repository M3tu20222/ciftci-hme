import mongoose, { Schema, type Document } from "mongoose";

export interface ITarlaSahip extends Document {
  tarla_id: mongoose.Types.ObjectId;
  sahipler: Array<{
    sahip_id: mongoose.Types.ObjectId;
    yuzde: number;
  }>;
  created_by: mongoose.Types.ObjectId;
}

const TarlaSahipSchema: Schema = new Schema(
  {
    tarla_id: { type: Schema.Types.ObjectId, ref: "Tarla", required: true },
    sahipler: [
      {
        _id: false, // Disable automatic _id for subdocuments
        sahip_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        yuzde: { type: Number, required: true },
      },
    ],
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TarlaSahip ||
  mongoose.model<ITarlaSahip>("TarlaSahip", TarlaSahipSchema);
