import mongoose, { Schema } from "mongoose";
import { mailSender } from "../utils/MailSender";

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

async function sendVerificationMail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification mail from CompTech Academy",
      otp
    );
    console.log("mail sending sucessfully", mailResponse);
  } catch (error) {
    console.log("Error occured while sending mail", error);
    throw error;
  }
}

OTPSchema.pre("save",async function (next) {
   await sendVerificationMail(this.mail,this.otp);
   next()

    
})

export const OTP = mongoose.model("OTP", OTPSchema);
