import { Course } from "../Models/Course.Model.js";
import { User } from "../Models/User.Model.js";
import { Category } from "../Models/Category.Model.js";
import { uploadImageCloudinary } from "../utils/ImageUploader.js";

const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      categoryId,
      tag,
    } = req.body;
    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !categoryId ||
      !thumbnail ||
      !tag
    ) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all fields",
      });
    }

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);

    if (!instructorDetails) {
      return res.status(400).json({
        status: false,
        message: "Instructor details not found",
      });
    }

    const categoryDetails = await Category.findById(categoryId);

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
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      tag: tag,
      status: "Draft",
    });

    await User.findByIdAndUpdate(
      instructorDetails._id,
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      categoryDetails._id,
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    const populatedCourse = await Course.findById(newCourse._id).populate({
      path: "instructor",
      select: "firstName lastName",
    });

    return res.status(201).json({
      status: true,
      message: "Course created successfully",
      data: populatedCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(400).json({
      status: false,
      message: "Failed to create course",
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
    );

    return res.status(200).json({
      status: true,
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "Error fetching courses",
    });
  }
};


const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        status: false,
        message: "Course ID is missing in the request body",
      });
    }

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select: "firstName lastName",
        populate: {
          path: "additionalDetails",
          select: "about",
        },
      })
      .populate("Category", "name description")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        status: false,
        message: `Course not found with ID: ${courseId}`,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: "Error fetching course details",
    });
  }
};

export { createCourse, getAllCourses, getCourseDetails };