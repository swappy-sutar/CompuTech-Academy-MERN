import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { Player } from "video-react";
import "video-react/dist/video-react.css";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || ""
  );

  const inputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
    noClick: true, // Disable default click to avoid conflicts
  });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleBrowseClick = () => {
    inputRef.current.click(); // Programmatically trigger file input click
  };

  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue, name]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[200px] sm:min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
        {...getRootProps()}
      >
        <input
          {...getInputProps()}
          ref={inputRef}
          onClick={(e) => e.stopPropagation()} // Prevent Dropzone from handling the click
        />
        {previewSource ? (
          <div className="flex w-full flex-col p-4 sm:p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-auto w-full max-h-[300px] rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-sm text-richblack-400 underline sm:text-base"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-4 sm:p-6">
            <div
              className="grid aspect-square w-12 sm:w-14 place-items-center rounded-full bg-pure-greys-800"
              onClick={handleBrowseClick}
            >
              <FiUploadCloud className="text-xl sm:text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[180px] sm:max-w-[200px] text-center text-xs sm:text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span
                className="font-semibold text-yellow-50 cursor-pointer"
                onClick={handleBrowseClick}
              >
                Browse
              </span>{" "}
              a file
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-4 text-center text-xs text-richblack-200 sm:gap-x-12">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}
