import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../Services/operations/courseDetailsAPI";

import { setCourse, setStep } from "../../../../../Slices/Course.slice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementsField";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();


  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  

useEffect(() => {
  const getCategories = async () => {
    setLoading(true);
    const categories = await fetchCourseCategories();
    if (categories.length > 0) {
      setCourseCategories(categories);
    }
    setLoading(false);
  };
  getCategories();


  if (editCourse && course) {
    console.log("categoryId", course.Category?._id);
    
    // Safeguard against undefined course data
    setValue("courseTitle", course.courseName || "");
    setValue("courseShortDesc", course.courseDescription || "");
    setValue("coursePrice", course.price || "");
    setValue("courseTags", course.tag || []);
    setValue("courseBenefits", course.whatYouWillLearn || "");
    setValue("categoryId", course.Category?._id || "");
    setValue("courseRequirements", course.instructions || []);
    setValue("courseImage", course.thumbnail || "");
  }

}, [editCourse, course, setValue]);


 const isFormUpdated = () => {
   const currentValues = getValues();
   // Handle null/undefined or nested values
   console.log("currentValues", currentValues);
   
   return (
     currentValues.courseTitle !== (course?.courseName || "") ||
     currentValues.courseShortDesc !== (course?.courseDescription || "") ||
     currentValues.coursePrice !== (course?.price || "") ||
     JSON.stringify(currentValues.courseTags) !==
       JSON.stringify(course?.tag || []) ||
     currentValues.courseBenefits !== (course?.whatYouWillLearn || "") ||
     currentValues.categoryId !== (course.Category?._id || "") ||
     JSON.stringify(currentValues.courseRequirements) !==
       JSON.stringify(course?.instructions || []) ||
     currentValues.courseImage !== (course?.thumbnail || "")
   );
 };



  

  //   handle next button click
  const onSubmit = async (data) => {
    console.log("data", data);

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        console.log("currentValues:", currentValues)
        console.log(
          "currentValues.categoryId !== course.Category?._id",
          currentValues.categoryId !== course.Category?._id
        );
        

        console.log({
          "currentValues.categoryId": currentValues.categoryId,
          "course.Category?._id": course.Category?._id,
        });

        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.categoryId !== course.Category?._id) {
          formData.append("categoryId", data.Category);
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== course.thumbnailImage) {
          formData.append("thumbnailImage", data.courseImage);
        }
        setLoading(true);
        const result = await editCourseDetails(formData, token);

        console.log("Edited result", result);

        setLoading(false);
        if (result) {
          dispatch(setCourse(result));
          dispatch(setStep(2));
        }
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }

    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("categoryId", data.categoryId);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage", data.courseImage);
    setLoading(true);
   

    const result = await addCourseDetails(formData, token);

        console.log("Created result", result);

    if (result) {
      dispatch(setCourse(result));
      dispatch(setStep(2));
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 overflow-hidden"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <p className="text-xl mb-8 mt-5  font-semibold  text-center  text-richblack-300">
          <span className="bg-richblack-900 p-5 rounded-full ">
            Course Information
          </span>
        </p>
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50 border border-richblack-50"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>
      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="w-full resize-x-none min-h-[130px] rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50 border border-richblack-50"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>
      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          {/* Input Field */}
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="w-full rounded-md bg-richblack-800 py-3 pl-10 pr-3 text-richblack-5 focus:outline-yellow-50 border border-richblack-50"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
          />
          {/* Icon */}
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-yellow-50" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="categoryId">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("categoryId", { required: true })}
          defaultValue=""
          id="categoryId"
          className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50 border border-richblack-50"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        >
          <option value="" disabled>
            Choose a Category
          </option>
         

          {!loading &&
            courseCategories?.map((category, indx) => (
              <option
                key={indx}
                value={category?._id}
                className="text-yellow-50"
              >
                {category?.name}
              </option>
            ))}
        </select>
        {errors.categoryId && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* Course thumbnailImage Image */}
      <Upload
        name="courseImage"
        label="Course thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="w-full resize-x-none min-h-[130px] rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50 border border-richblack-50"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>

      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
