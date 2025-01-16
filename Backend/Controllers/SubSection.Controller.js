import { SubSection } from "../Models/SubSection.Model.js";
import { Section } from "../Models/Section.Model.js";
import { uploadImageCloudinary } from "../utils/ImageUploader.js";

const createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description, timeDuration } = req.body;
    const video = req.files.video;

    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        sucess: false,
        message: "Please fill in all fields",
      });
    }

    const uploadVideo = await uploadImageCloudinary(
      video,
      process.env.CLOUDINARY_FOLDER_NAME
    );

    const subSectionDetails = await SubSection.create({
      title,
      description,
      timeDuration,
      videoUrl: uploadVideo.secure_url,
    });

    const updateSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSections: subSectionDetails._id } },
      { new: true }
    ).populate("subSections");

    console.log("updateSection", updateSection);
    

    return res.status(200).json({
      sucess: true,
      message: "Sub-section created successfully",
      data: updateSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "An error occurred while creating sub-section",
    });
  }
};

const updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }
    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate(
      "subSections"
    );

    return res.json({
      success: true,
      message: "Sub-section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "An error occurred while updating the sub-section",
    });
  }
};

const deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body;

    if (!sectionId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Please provide both section ID and sub-section ID",
      });
    }

    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );

    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subSections"
    );

    return res.status(200).json({
      success: true,
      message: "Sub-section deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "An error occurred while deleting sub-section",
    });
  }
};

export { createSubSection, updateSubSection, deleteSubSection };
