import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
  },
  image: {
    type: String,
    required: true,
  },
  additionalDetails: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  token:{
    type:String,
  },
  resetPasswordExpires:{
    type:Date
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  coursesProgress: [
    {
      type: Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
},{timestamps:true});

export const User = mongoose.model("User", userSchema);
