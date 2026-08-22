import { Schema, model } from "mongoose";

const contentSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "site-content",
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Content = model("Content", contentSchema);
