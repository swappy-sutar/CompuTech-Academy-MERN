import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../Services/operations/courseDetailsAPI";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { formatDate } from "../../../../Services/formatDate";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

function CourseTable({ courses, setCourses }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const TRUNCATE_LENGTH = 8;

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setLoading(false);
    setConfirmationModal(null);
  };

  return (
    <>
      <Table className="rounded-2xl border border-richblack-50 bg-richblack-800">
        <Thead className="bg-richblack-600">
          <Tr className="border-b border-richblack-300 px-8 py-5">
            <Th className="text-left pl-2 p-3 text-md font-semibold uppercase text-richblack-100 border-r border-richblack-300">
              Sr.
            </Th>
            <Th className="text-left pl-5 text-md font-semibold uppercase text-richblack-100 sm:text-richblack-100 border-r border-richblack-300">
              Courses
            </Th>
            <Th className="text-center text-md font-semibold uppercase text-richblack-100 sm:w-[100px] md:w-[120px] lg:w-[120px] border-r border-richblack-300">
              Duration
            </Th>
            <Th className="text-center text-md font-semibold uppercase text-richblack-100 sm:w-[100px] md:w-[120px] lg:w-[120px] border-r border-richblack-300">
              Price
            </Th>
            <Th className="text-center text-md font-semibold uppercase text-richblack-100 sm:w-[100px] md:w-[120px] lg:w-[120px]">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td
                className="py-10 text-center text-3xl font-medium text-richblack-100"
                colSpan={5}
              >
                No courses found !!
              </Td>
            </Tr>
          ) : (
            courses?.map((course, index) => (
              <Tr key={course._id} className="border-b border-richblack-300">
                <Td className="text-left pl-3 text-md text-richblack-100 border-r border">
                  {index + 1}
                </Td>

                <Td className="p-4 border-r text-richblack-300 border-richblack-300">
                  <div className="flex gap-x-4 flex-wrap lg:flex-nowrap">
                    <div className="w-[220px] h-[150px] overflow-hidden rounded-lg shadow-md border border-richblack-700">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info Column */}
                    <div className="flex flex-col justify-between flex-1 mt-2 lg:mt-0">
                      <p className="text-xl font-semibold text-richblack-5">
                        {course.courseName}
                      </p>
                      <p className="text-sm text-richblack-300 mt-2">
                        {course.courseDescription.split(" ").length >
                        TRUNCATE_LENGTH
                          ? course.courseDescription
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                          : course.courseDescription}
                      </p>
                      <p className="text-sm text-richblack-400 mt-2">
                        Created: {formatDate(course.createdAt)}
                      </p>
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <div className="mt-4 flex items-center gap-2 w-fit rounded-full bg-richblack-700 px-3 py-1 text-sm font-medium text-pink-100">
                          <HiClock size={14} />
                          Drafted
                        </div>
                      ) : (
                        <div className="mt-4 flex items-center gap-2 w-fit rounded-full bg-richblack-700 px-3 py-1 text-sm font-medium text-yellow-100">
                          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                            <FaCheck size={8} />
                          </div>
                          Published
                        </div>
                      )}
                    </div>
                  </div>
                </Td>

                {/* Duration */}
                <Td className="text-sm font-medium text-center text-richblack-100 truncate sm:w-[100px] md:w-[120px] lg:w-[120px] border-r border-richblack-300">
                  2hr 30min
                </Td>

                {/* Price */}
                <Td className="text-sm text-center font-medium text-richblack-100 truncate sm:w-[100px] md:w-[120px] lg:w-[120px] border-r border-richblack-300">
                  ₹{course.price}
                </Td>

                {/* Actions */}
                <Td className="flex justify-center text-center sm:gap-x-5 py-4 pt-20 items-center gap-x-4 text-sm font-medium text-richblack-100">
                  <button
                    disabled={loading}
                    onClick={() =>
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }
                    title="Edit"
                    className="transition-transform duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted.",
                        btn1Text: !loading ? "Delete" : "Loading...",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }
                    title="Delete"
                    className="transition-transform duration-200 hover:scale-110 hover:text-red-500"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

export default CourseTable;
