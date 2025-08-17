import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../Services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import { FaPlus } from "react-icons/fa6";
import CourseTable from "./InstructorCourses/CourseTable";

function MyCourses() {
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="px-4 sm:px-8 lg:px-4 h-[100%] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-4xl sm:text-4xl font-semibold text-richblack-300">
          My Courses
        </h1>
        <div className="mt-4 sm:mt-0 flex justify-end sm:justify-start">
          <IconBtn
            text="Add Course"
            onclick={() => navigate("/dashboard/add-course")}
            className="w-full sm:w-auto"
          >
            <FaPlus className="text-richblack-900" />
          </IconBtn>
        </div>
      </div>

      <div className="overflow-x-auto">
        <CourseTable courses={courses} setCourses={setCourses} />
      </div>
    </div>
  );
}

export default MyCourses;
