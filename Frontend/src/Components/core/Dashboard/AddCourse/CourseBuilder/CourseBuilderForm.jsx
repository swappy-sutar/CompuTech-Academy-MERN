import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RxCrossCircled } from "react-icons/rx";
import {
  createSection,
  updateSection,
} from "../../../../../Services/operations/courseDetailsAPI";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../Slices/Course.slice";
import IconBtn from "../../../../Common/IconBtn";
import NestedView from "./NestedView";

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    try {
      if (editSectionName) {
        const currentSection = course?.courseContent?.find(
          (section) => section._id === editSectionName
        );

        if (currentSection && currentSection.sectionName === data.sectionName) {
          toast.error("No changes made in the section name");
          setLoading(false);
          return;
        }

        result = await updateSection(
          {
            sectionName: data.sectionName,
            sectionId: editSectionName,
            courseId: course._id,
          },
          token
        );

        if (result) {
          dispatch(setCourse(result));
          setEditSectionName(null);
          setValue("sectionName", "");
          toast.success("Section updated");
        } else {
          toast.error("Failed to update the section.");
        }
      } else {
        result = await createSection(
          {
            sectionName: data.sectionName,
            courseId: course._id,
          },
          token
        );

        if (result) {
          dispatch(setCourse(result));
          setValue("sectionName", "");
          toast.success("Section created");
        } else {
          toast.error("Failed to create the section.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  // Handle editing section name
  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section");
      return;
    }
    if (
      course.courseContent.some((section) => section.subSections.length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section");
      return;
    }
    dispatch(setStep(3));
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="w-full rounded-md bg-richblack-800 py-3 px-3 text-richblack-5 focus:outline-yellow-50 border border-richblack-50"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-center gap-x-4 ">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
            <div className="flex items-center justify-center text-center text-sm px-2 py-3 text-richblack-300 gap-2 rounded-md transition-all duration-200 hover:text-yellow-50 focus:outline-yellow-50 border border-richblack-50  hover:border hover:border-yellow-50">
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-2  font-semibold"
              >
                Cancel Edit
                <RxCrossCircled className="text-lg unterline not-italic" />
              </button>
            </div>
          )}
        </div>
      </form>

      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
        >
          Back
        </button>
        <button
          className="flex items-center justify-center gap-1 bg-yellow-50 hover:bg-yellow-100 rounded-lg p-2 font-semibold"
          disabled={loading}
          onClick={() => goToNext()}
        >
          <span>Next</span>
          <MdNavigateNext className="text-lg" />
        </button>
      </div>
    </div>
  );
}
