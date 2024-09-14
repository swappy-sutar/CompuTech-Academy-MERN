import { SubSection } from "../Models/SubSection.Model.js";
import { Section } from "../Models/Section.Model";
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

    const subSectionDetails = SubSection.create({
      title,
      desciption,
      timeDuration,
      videoUrl: uploadVideo.secure_url,
    });

    const updateSection = await Section.findByIdAndUpdate(
      {
        _id: sectionId,
      },
      {
        $push: {
          subSections: subSectionDetails._id,
        },
      },
      {
        new: true,
      }
    ).populate(
        "subSections",
    ).exec();

    return res.status(200).json({
      sucess: true,
      data: updateSection,
      message: "SubSection created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Error creating SubSection",
    });
  }
};


const updateSubSection = async (req,res) => {
  try {
    
    
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Error updating SubSection",
      });
    
  }
  
}

const deleteSubSection = async (req, res) => {
  try {
    
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Error deleting SubSection",
      });
    
  }

};


export { createSubSection };