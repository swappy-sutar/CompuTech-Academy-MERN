import { createSlice } from "@reduxjs/toolkit";
import { deleteSection } from "../Services/operations/courseDetailsAPI";

const initialState = {
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    setEditCourse: (state, action) => {
      state.editCourse = action.payload;
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload;
    },
    resetCourseState: (state) => {
      state.step = 1;
      state.course = null;
      state.editCourse = false;
    },
    deleteCourseSection: (state, action) => {
      let updatedCourseContent = state.course.courseContent.filter((section) => {
        if (action.payload != section._id) return true;
        return false;
      });
      state.course.courseContent = updatedCourseContent;
    },
  },
});

export const {
  setStep,
  setCourse,
  setEditCourse,
  setPaymentLoading,
  resetCourseState,
  deleteCourseSection,
} = courseSlice.actions;

export default courseSlice.reducer;
