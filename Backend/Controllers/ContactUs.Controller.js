import { ContactUs } from "../Models/ContactUs.Model.js";
import { mailSender } from "../utils/MailSender.js";

const sendMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    const contactUs = await ContactUs.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    });

    const mailRes = await mailSender(
      email,
      "Welcome to CompuTech Academy",
      `<p>Dear ${firstName} ${lastName},</p>
       <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
       <p>Best Regards,<br>CompuTech Academy Team</p>`
    );
        
    if (mailRes.success) {
      return res.status(200).json({
        success: true,
        message: "Your message has been received, and email has been sent.",
        contact: contactUs,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Message saved, but we could not send the email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({
      success: false,
      message: "Error sending message",
    });
  }
};

export { sendMessage };