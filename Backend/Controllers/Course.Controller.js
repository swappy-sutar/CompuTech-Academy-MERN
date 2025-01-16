import { Course } from "../Models/Course.Model.js";
import { User } from "../Models/User.Model.js";
import { Category } from "../Models/Category.Model.js";
import { uploadImageCloudinary } from "../utils/ImageUploader.js";
import { Section} from "../Models/Section.Model.js"
import { SubSection } from "../Models/SubSection.Model.js";

const createCourse = async (req, res) => {
  try {
    const userId = req.user.id;

    const { courseName, courseDescription, whatYouWillLearn, price, tag: _tag, categoryId, status, instructions: _instructions } = req.body;
    const thumbnail = req.files.thumbnailImage;

    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !categoryId ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    const categoryDetails = await Category.findById(categoryId);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    const thumbnailImage = await uploadImageCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
   
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      categoryId: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
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
      { new: true }
    );


    const updatedCategoryDetails = await Category.findByIdAndUpdate(
      { _id: categoryId },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(400).json({
     success: false,
      message: "Failed to create course",
    });
  }
};

const updateCourse = async (req,res) => {
  try {
     const { courseId } = req.body;
     const updates = req.body;

     const course = await Course.findById(courseId);

     if (!course) {
       return res.status(400).json({ 
          success: false, 
          message: "Course not found" 
        });
     }

     if (req.files) {
       const thumbnail = req.files.thumbnailImage;
       const thumbnailImage = await uploadImageCloudinary(
         thumbnail,
         process.env.FOLDER_NAME
       );
       course.thumbnail = thumbnailImage.secure_url;
     }

     for (const key in updates) {
       if (updates.hasOwnProperty(key)) {
         if (key === "tag" || key === "instructions") {
           course[key] = JSON.parse(updates[key]);
         } else {
           course[key] = updates[key];
         }
       }
     }

     await course.save();

     const updatedCourse = await Course.findOne({
       _id: courseId,
     })
       .populate({
         path: "instructor",
         populate: {
           path: "additionalDetails",
         },
       })
       .populate("category")
       .populate("ratingAndReviews")
       .populate({
         path: "courseContent",
         populate: {
           path: "subSection",
         },
       })
       .exec();

     return res.json({
       success: true,
       message: "Course updated successfully",
       data: updatedCourse,
     });
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Failed to update course",
    })
  }
}

const deleteCourse = async (req,res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
  
}

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
     success: true,
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
     success: false,
      message: "Error fetching courses",
    });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
       success: false,
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
       success: false,
        message: `Course not found with ID: ${courseId}`,
      });
    }

    return res.status(200).json({
     success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
     success: false,
      message: "Error fetching course details",
    });
  }
};

export { createCourse, updateCourse, deleteCourse, getAllCourses, getCourseDetails };