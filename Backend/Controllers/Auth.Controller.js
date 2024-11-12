import { User } from "../Models/User.Model.js";
import { mailSender } from "../utils/MailSender.js";
import { OTP } from "../Models/Otp.Model.js";
import { Profile } from "../Models/Profile.Model.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        status: false,
        message: "User already registered",
      });
    }

    let otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      lowercase: false,
      specialChars: false,
    });

    while (await OTP.findOne({ otp })) {
      otp = otpGenerator.generate(6, {
        digits: true,
        upperCase: false,
        lowercase: false,
        specialChars: false,
      });
    }

    const optPayload = { email, otp };

    const otpBody = await OTP.create(optPayload);

    const mailRes = await mailSender(
      email,
      "Your Verification OTP - Compu-Tech Academy",
      `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">Welcome to CompuTech Academy</h2>
          <p>Dear ${email},</p>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <h3 style="background-color: #f8f8f8; padding: 10px; text-align: center; border: 1px dashed #ccc; color: #333;">${otp}</h3>
          <p>Please use this OTP within 10 minutes.</p>
          <p>Best Regards,<br>Compu-Tech Academy Team</p>
        </div>
      `
    );


    if (mailRes && mailRes.accepted && mailRes.accepted.includes(email)) {
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully. Please check your email.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message:
          "OTP generated, but we could not send the email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      conformPassword,
      accountType,
      otp,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !conformPassword) {
      return res.status(400).json({
        status: false,
        message: "Please fill all the fields",
      });
    }

    if (password !== conformPassword) {
      return res.status(400).json({
        status: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "Email already exists",
      });
    }

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        status: false,
        message: "OTP not found",
      });
    }

    if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    res.status(200).json({
      status: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: `User can't be registered. Please try again later.`,
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const payload = {
      id: user._id, 
      email: user.email,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "2d", 
    });

    user.password = undefined;

    const cookieOptions = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
    };

    return res.status(200).cookie("token", token, cookieOptions).json({
      success: true,
      token,
      user,
      message: "Logged in successfully.",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password must match",
      });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    const email = user.email; 
    const mailRes = await mailSender(
      email,
      "Password Changed Successfully - Compu-Tech Academy",
      `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">Password Changed Successfully</h2>
          <p>Dear "${user.firstName}",</p>
          <p>Your password has been changed successfully.</p>
          <p>If you did not request this change, please contact our support team immediately.</p>
          <p>Best Regards,<br>Compu-Tech Academy Team</p>
        </div>
      `
    );

    if (mailRes && mailRes.accepted && mailRes.accepted.includes(email)) {
      return res.status(200).json({
        success: true,
        message:
          "Password changed successfully. A confirmation email has been sent.",
      });
    } else {
      return res.status(500).json({
        success: true,
        message:
          "Password changed successfully, but the confirmation email could not be sent.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while changing the password",
    });
  }
};

export { sendOTP, signup, login, changePassword };
