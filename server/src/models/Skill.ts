import { Schema, model } from "mongoose";

const skillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["DESIGN", "DEVELOPMENT", "TOOLS", "OTHER"],
      default: "DESIGN",
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    audience: {
      type: String,
      enum: ["freelance", "job", "both"],
      default: "job",
    },
  },
  {
    timestamps: true,
  }
);

export const Skill = model("Skill", skillSchema);
