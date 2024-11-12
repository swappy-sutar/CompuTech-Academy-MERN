import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema({
  sectionName: {
    type: String,
    required: true,
  },
  subSections: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export const Section = mongoose.model("Section", sectionSchema);
