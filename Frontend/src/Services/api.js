const BASE_URL = import.meta.env.VITE_BACKEND_URL+"api/v1";

export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-OTP",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/get-user-details",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/get-enrolled-courses",
};

export const categoriesEndpoint = {
  CATEGORIES_API: BASE_URL + "/course/get-all-categories",
  CREATE_CATEGORIES_API: BASE_URL + "/course/create-category",
};

export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/support/send-message",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/get-all-courses",
  COURSE_DETAILS_API: BASE_URL + "/course/get-course-details",
  EDIT_COURSE_API: BASE_URL + "/course/update-course",
  // COURSE_CATEGORIES_API: BASE_URL + "/course/get-all-categories",
  CREATE_COURSE_API: BASE_URL + "/course/create-course",
  CREATE_SECTION_API: BASE_URL + "/course/create-section",
  CREATE_SUBSECTION_API: BASE_URL + "/course/create-sub-section",
  UPDATE_SECTION_API: BASE_URL + "/course/update-section",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/update-sub-section",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/get-instructor-courses",
  DELETE_SECTION_API: BASE_URL + "/course/delete-section",
  DELETE_SUBSECTION_API: BASE_URL + "/course/delete-sub-section",
  DELETE_COURSE_API: BASE_URL + "/course/delete-course",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:BASE_URL + "/course/get-full-course-details",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/create-rating",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/get-category-page-details",
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/update-display-picture",
  UPDATE_NAME_API: BASE_URL + "/profile/update-name",
  UPDATE_PROFILE_API: BASE_URL + "/profile/update-profile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/change-password",
  DELETE_PROFILE_API: BASE_URL + "/profile/delete-account",
};