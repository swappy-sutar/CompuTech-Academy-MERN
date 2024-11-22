const BASE_URL = import.meta.env.VITE_BASE_URL;

console.log("BASE_URL", BASE_URL);


export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-OTP",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};
console.log("endpoints", endpoints.SIGNUP_API);


// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
};

export const categories = {
  CATEGORIES_API: BASE_URL + "/course/get-all-categories",
};

export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/support/send-message",
};