import mongoose from "mongoose";
import { instance } from "../Config/Razorpay.Config.js";
import { Course } from "../Models/Course.Model.js";
import { User } from "../Models/User.Model.js";
import { mailSender } from "../utils/MailSender.js";

const capturePayment = async (req, res) => {
    try {
        const { course_id } = req.body;
        const userId = req.user.id;

        if (!course_id) {
            return res.status(400).json({
                sucess: false,
                message: "Course ID is required",
            });
        }

        let course;
        try {
        course = await Course.findById(course_id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentEnrolled.includes(uid)) {
                return res.status(400).json({
                success: false,
                message: "You have already enrolled in this course",
            });
        }
        } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error occurred while fetching course",
        });
        }

        const amount = course.price;
        const currecny = "INR";
        const options = {
            amount: amount * 100,
            currency: currecny,
            notes: {
                courseId: course_id,
                description: "Course Payment",
                userId,
            },
        };

        try {
            const paymentResp = await instance.orders.create(options);
            console.log(paymentResp);
            return res.status(200).json({
                success: true,
                courseDescription: course.courseDescription,
                courseName: course.courseName,
                thumbnail: course.thumbnail,
                orderId: paymentResp.amount,
                amount: paymentResp.amount / 100,
                message: "Payment initiated successfully",
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: "Error occurred while creating payment order",
            });
        }
    } catch (error) {
        console.log(error);
            return res.status(400).json({
            success: false,
            message: "Error occurred while processing payment",
        });
    }
};


const verifySignature = async (req, res) => {

  const webhookSecret = "123456789";
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));

  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is authorized");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          $push: { studentEnrolled: userId },
        },
        {
          new: true,
        }
      );

      if (!enrolledCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      const enrolledUser = await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true }
      );

      if (!enrolledUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const mailRes = await mailSender(
        enrolledUser.email,
        "Welcome to CompuTech Academy",
        `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">Welcome to CompuTech Academy!</h2>
          <p>Dear ${enrolledUser.firstName},</p>
          <p>We are excited to inform you that you have successfully enrolled in the course: <strong>${enrolledCourse.courseName}</strong>.</p>
          <p>We hope you enjoy the learning experience and gain valuable knowledge!</p>
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p>Best Regards,<br>CompuTech Academy Team</p>
        </div>
        `
      );

      if (mailRes && mailRes.accepted.includes(enrolledUser.email)) {
        return res.status(200).json({
          success: true,
          message: "Course enrolled successfully and confirmation email sent.",
        });
      } else {
        return res.status(400).json({
          success: true,
          message: "Course enrolled successfully, but email could not be sent.",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Failed to enroll in the course",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request signature",
    });
  }
};


export { capturePayment, verifySignature };