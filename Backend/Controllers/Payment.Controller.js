import mongoose from "mongoose";
import { instance } from "../Config/Razorpay.Config";
import { Course } from "../Models/Course.Model";
import { User } from "../Models/User.Model";
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

    const shasum = crypto.createHmac("sha256",    webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
        console.log("Payment is Authorised");

        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
        const enrolledCourse = await Course.findByIdAndUpdate(
            { _id: courseId },
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
            console.log("enrolledCourse", enrolledCourse);

        const enrolledUser = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        {new:true}
        );

        console.log("enrolled User", enrolledUser);


        const mailRes = mailSender(enrolledUser.email,
            "Congratulation to CompuTech-Academy",
            `Purchase ${enrolledCourse.courseName} course`);

            console.log("mailRes", mailRes);

            return res.status(200).json({
                success: true,
                message: "Course Enrolled Successfully", 
            })
        

        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: "Failed to Enroll Course",
            });
        }
    }else{
        return res.status(400).json({
            success: false,
            message: "Invalid Request",
            });
    }

};


export { capturePayment, verifySignature };