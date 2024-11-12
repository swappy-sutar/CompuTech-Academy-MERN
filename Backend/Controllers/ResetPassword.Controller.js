import { User } from "../Models/User.Model.js";
import { mailSender } from "../utils/MailSender.js";
import bcrypt from "bcrypt";

const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const token = crypto.randomUUID();

    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // Expires in 5 minutes
      },
      {
        new: true,
      }
    );

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      user.email,
      "Reset Your Password - CompuTech Academy",
      `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">Password Reset Request</h2>
          <p>Hi ${user.firstName},</p>
          <p>You have requested to reset your password for your CompuTech Academy account. Click the button below to reset your password:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:3000/update-password/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </p>
          <p>If you did not request this, please ignore this email or contact our support if you have any concerns.</p>
          <p>This password reset link will expire in 5 minutes.</p>
          <p>Thank you,<br>CompuTech Academy Team</p>
        </div>
        `
    );

    return res.status(200).json({
      status: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error in resetPasswordToken:", error);
    return res.status(500).json({
      status: false,
      message: "Error sending password reset link",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, conformPassword } = req.body;
    const user = await User.findOne({ token });
    
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Invalid token",
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(404).json({
        status: false,
        message: "Password reset link has expired",
      });
    }

    if (newPassword !== conformPassword) {
      return res.status(400).json({
        status: false,
        message: "Passwords do not match",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "Error resetting password",
    });
  }
};

export { resetPasswordToken, resetPassword };
