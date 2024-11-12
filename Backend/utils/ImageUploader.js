import { v2 as cloudinary } from "cloudinary";

const uploadImageCloudinary = async (file, folder, height, quality) => {
  const options = {
    folder,
    resource_type: "auto",
  };

  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  try {
    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
};

export { uploadImageCloudinary };
