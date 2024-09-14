import mongoose, { Schema } from "mongoose";

const courseProgressSchema = new Schema({
  courseID: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  completedVideos: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
 