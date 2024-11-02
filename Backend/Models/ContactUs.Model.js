import mongoose, { Schema } from "mongoose";

const contactUsSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const ContactUs = mongoose.model("ContactUs", contactUsSchema);
