import { Course } from "../Models/Course.Model.js";
import { Section } from "../Models/Section.Model.js";

const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        sucess: false,
        message: "Please provide all required fields",
      });
    }
    const newSection = await Section.create({ sectionName });

    const updateCourseDetails = await Course.findByIdAndUpdate(
      { courseId },
      {
        $push: { couresContent: newSection._id },
      },
      {
        new: true,
      }
    )
      .populate("sectionName")
      .populate("subSection")
      .exec();

    return res.status(200).json({
      success: true,
      data: updateCourseDetails,
      message: "Section created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      sucess: false,
      message: "Error creating section",
    });
  }
};

const updateSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        sucess: false,
        message: "Please provide all required fields",
      });
    }

    const updateSection = await Section.findByIdAndUpdate(
      courseId,
      {
        sectionName,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: updateSection,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      sucess: false,
      message: "Error updating section",
    });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Please provide section id",
      });
    }
    const deleteSection = await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Error deleting section",
    });
  }
};

export { createSection, updateSection,deleteSection };
