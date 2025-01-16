import { Course } from "../Models/Course.Model.js";
import { Section } from "../Models/Section.Model.js";

const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newSection = await Section.create({ sectionName });

    const updateCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .populate({
        path: "instructor",
        select: "-password",
      })
      .select("-password")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updateCourseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "An error occurred while creating section",
    });
  }
};

const updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    if(!section){
      return res.status(400).json({
        success: false,
        message: "Section not found",
      });
    }

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();
      
    
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating section",
    });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.body;

    const sectionIdExist = await Section.findById({
      _id: sectionId,
    });

    if (!sectionIdExist) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "An error occurred while deleting section",
    });
  }
};

export { createSection, updateSection, deleteSection };
