import { Profile } from "../Models/Profile.Model.js";
import { User } from "../Models/User.Model.js";
import { Course } from "../Models/Course.Model.js";
import { uploadImageCloudinary } from "../utils/ImageUploader.js";

const updateUserName = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const email = req.user.email;

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      });
    }

    const userDetails = await User.findOneAndUpdate(
      { email }, 
      { firstName, lastName }, 
      { new: true }
    );

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Name updated successfully",
      data: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      },
    });
  } catch (error) {
    console.error("Error in updateUserName:", error);
    return res.status(400).json({
      success: false,
      message: "An error occurred while updating the profile",
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { gender, dateOfbirth = "", about = "", contactNumber } = req.body;

    const id = req.user.id;

    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        scuess: false,
        message: "Please fill all the fields",
      });
    }

    const userDetails = await User.findById(id);

    const profileId = userDetails.additionalDetails;

    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfbirth = dateOfbirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    await profileDetails.save();


     const updatedUserDetails = await User.findById(id)
       .select("-password")
       .populate("additionalDetails");

    // console.log("updatedUserDetails", updatedUserDetails);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully..!!",
      data: updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "An error occurred while updating the user profile",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Profile.findByIdAndDelete({
      _id: user.additionalDetails,
    });

    if (user.accountType === "Instructor") {
      await Course.deleteMany({ instructor: id });
    }

    await Course.updateMany(
      { studentsEnrolled: id },
      {
        $pull: { studentsEnrolled: id },
      }
    );

    await User.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "An error occurred while deleting account",
    });
  }
};

const updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: "User is not authenticated or user ID is missing.",
      });
    }

    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const displayPicture = req.files.displayPicture;

    const validMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validMimeTypes.includes(displayPicture.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, JPG and PNG are allowed.",
      });
    }

    const maxSize = 15 * 1024 * 1024; // 15 MB
    if (displayPicture.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the maximum limit of 15MB.",
      });
    }

    const image = await uploadImageCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      100
    );

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.send({
      success: true,
      message: "Image updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error in updateDisplayPicture:", error);
    return res.status(400).json({
      success: false,
      message: "An error occurred while updating display picture.",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "An error occurred while fetching user data",
    });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec();
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "An error occurred while fetching enrolled courses",
    });
  }
};

export { updateUserName, updateProfile, deleteAccount, getAllUsers, updateDisplayPicture, getEnrolledCourses };
