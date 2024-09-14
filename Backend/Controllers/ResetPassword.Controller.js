import { User } from "../Models/User.Model";
import { mailSender } from "../utils/MailSender";

const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    const token = crypto.randomUUID();

    const updateDetails = await User.findByIdAndUpdate(
      {
        email: email,
      },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true,
      }
    );

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      user.email,
      "Reset Password Link",
      `Reset Password link: ${url}`
    );

    return res.status(200).json({
      status: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
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

    if (user.resetPasswordExpires <  Date.now()) {
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
