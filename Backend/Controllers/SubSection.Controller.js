import { SubSection } from "../Models/SubSection.Model.js";
import { Section } from "../Models/Section.Model.js";
import { uploadImageCloudinary } from "../utils/ImageUploader.js";

const createSubSection = async (req, res) => {
  try {
    const { sectionId, title, desciption, timeDuration } = req.body;
    const video = req.files.videoFile;

    if (!sectionId || !title || !desciption || !timeDuration || !video) {
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
      desciption,
      timeDuration,
      videoUrl: uploadVideo.secure_url,
    });

    const updateSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSections: subSectionDetails._id } },
      { new: true }
    ).populate("subSections"); 

    return res.status(200).json({
      sucess: true,
      message: "SubSection created successfully",
      data: updateSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Error creating SubSection",
    });
  }
};


const updateSubSection = async (req, res) => {
  try {
    const { sectionId, title, desciption } = req.body;

    const subSection = await SubSection.findById(sectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }
    if (desciption !== undefined) {
      subSection.desciption = desciption;
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

     const updatedsection = await subSection.save();

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedsection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
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

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: { subSections: subSectionId }
      },
      {
        new: true, 
      }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found or sub-section not removed",
      });
    }

    await SubSection.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "Sub-section deleted successfully",
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting sub-section",
    });
  }
};



export { createSubSection, updateSubSection, deleteSubSection };