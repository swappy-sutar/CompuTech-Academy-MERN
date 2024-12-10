import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("displayPicture", imageFile);
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false);
      });
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full">
        {/* Image */}
        <img
          src={previewSource || user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[78px] lg:w-[100px] rounded-full object-cover"
        />

        {/* Text and buttons */}
        <div className="space-y-2 w-full text-center lg:text-left">
          <p className="text-sm lg:text-base">Change Profile Picture</p>
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-center lg:items-start w-full">
            {/* Select Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <button
              onClick={handleClick}
              disabled={loading}
              className="cursor-pointer gap-x-2 rounded-md py-2 px-8 sm:py-3 sm:px-8 font-semibold text-richblack-900 bg-richblack-500 sm:text-sm lg:text-base hover:bg-richblack-600 transition-all duration-300 ease-in-out"
            >
              Select
            </button>

            {/* Upload Button */}
            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleFileUpload}
              className=" flex items-center justify-center sm:px-3 sm:py-2 sm:text-sm lg:px-5 lg:py-3 lg:text-base cursor-pointer gap-x-2 rounded-md py-2 px-4 font-semibold text-richblack-900"
            >
              {!loading && <FiUpload className="text-lg text-richblack-900" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
