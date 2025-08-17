import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../Slices/Profile.slice";
import { apiConnector } from "../apiConnector.js"
import { profileEndpoints } from "../api.js"
import { logout } from "./authAPI"

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API } = profileEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(setUser({ ...response.data.data, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
       const errorMessage =
         error.response?.data?.message ||
         error.message ||
         "An error occurred while getting User Details";
       toast.error(errorMessage);
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export async function getUserEnrolledCourses(token) {
  let result = [];
  const toastId = toast.loading("Loading...");

  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to fetch courses");
    }

    result = response.data?.data || [];
    toast.success("Enrolled Courses Fetched Successfully");
  } catch (error) {
   const errorMessage =
     error.response?.data?.message ||
     error.message ||
     "An error occurred while getting User Enrolled Course";
   toast.error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }

  return result;
}

