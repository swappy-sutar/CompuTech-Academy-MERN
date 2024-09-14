import Course from "../Models/Course.Model.js";
import User from "../Models/User.Model.js";
import Tag from "../Models/Tag.Model.js";
import { uploadImageCloudinary } from "../utils/ImageUploader.js";

const createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, Category } =
      req.body;
    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !Category ||
      !thumbnail
    ) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all fields",
      });
    }

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);

    console.log("instructor Details", instructorDetails);

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "instructor details not found",
      });
    }

    const categoryDetails = await Category.findById(Category);

    if (!categoryDetails) { 
      return res.status(400).json({
        status: false,
        message: "Category details not found",
      });
    }

    const thumbnailImage = await uploadImageCloudinary(
      thumbnail,
      process.env.CLOUDINARY_FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      Category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    await Category.findByIdAndUpdate(
      {
        _id: categoryDetails._id,
      },
      {
        $push: {
          course: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: true,
      data: newCourse,
      message: "Course created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "Error creating course",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    ).populate("instructor")
    .exec();

    return res.status(200).json({
      status: true,
      data: courses,
      message: "Courses retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "Error fetching courses",
    });
  }
};

export { createCourse, getAllCourses };
