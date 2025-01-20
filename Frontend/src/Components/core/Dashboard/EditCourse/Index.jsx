import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../../../../Services/operations/courseDetailsAPI";
import {setCourse,setEditCourse} from "../../../../Slices/Course.slice"
import RenderSteps from "../AddCourse/RenderSteps";

function EditCourse() {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.courseDetails));
        
      }
      setLoading(false);
    };
    populateCourseDetails();
  }, []);


  return (
    <div className="px-4 sm:px-8 lg:px-4 h-[100%] space-y-6">
        <h1 className="text-4xl sm:text-4xl font-semibold text-richblack-300">
          Edit Course
        </h1>

        <div>{course ? <RenderSteps /> : null}</div>
      </div>
  
  );
}

export default EditCourse;
