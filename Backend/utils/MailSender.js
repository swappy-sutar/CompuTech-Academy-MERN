import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT || 587,
      secure: process.env.MAIL_SECURE === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: '"CompuTech-Academy || by-SwappySutar" Sutarswapnil322@gmail.com',
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail response:", info);
    return {
      success: info.accepted.length > 0, 
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (error) {
    console.error("Error sending mail:", error.message);
    return { success: false, message: error.message };
  }
};

export { mailSender };
