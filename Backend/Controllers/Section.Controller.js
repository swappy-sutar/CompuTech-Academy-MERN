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
      {
        new: true,
      }
    )
      .populate("courseContent")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: updateCourseDetails,
      message: "Section created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error creating section",
    });
  }
};

const updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName: sectionName,
      },
      {
        new: true,
      }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating section",
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
    
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Please provide section id",
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
      message: "Error deleting section",
    });
  }
};

export { createSection, updateSection, deleteSection };
