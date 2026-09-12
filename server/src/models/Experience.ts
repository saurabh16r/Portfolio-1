import { Schema, model } from "mongoose";

const experienceSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      default: "Present",
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    technologies: {
      type: [String],
      default: [],
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

export const Experience = model("Experience", experienceSchema);
