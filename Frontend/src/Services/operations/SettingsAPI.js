import { toast } from "react-hot-toast";

import { setUser } from "../../Slices/Profile.slice";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../api";
import { logout } from "./authAPI";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_NAME_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "POST",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Picture Updated Successfully");
      dispatch(setUser(response.data.data));
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while Updating Display Picture";
      toast.error(errorMessage);
    }
    toast.dismiss(toastId);
  };
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      if (!formData.firstName || !formData.lastName) {
        throw new Error("First Name and Last Name are required");
      }

      const response = await apiConnector(
        "POST",
        UPDATE_PROFILE_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const nameUpdateResponse = await apiConnector(
        "POST",
        UPDATE_NAME_API,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("UPDATE_PROFILE_API RESPONSE............", response);
      console.log("UPDATE_NAME_API RESPONSE............", nameUpdateResponse);

      const updatedUserDetails = response.data;

      // Update user image
      const userImage = updatedUserDetails.image
        ? updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${formData.firstName} ${formData.lastName}`;

      // Dispatch the updated user details
      dispatch(
        setUser({
          ...updatedUserDetails,
          image: userImage,
        })
      );

      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error("Error while updating profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while Updating Profile";
      toast.error(errorMessage);
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password Changed Successfully");
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while changing password";
    toast.error(errorMessage);
  }
  toast.dismiss(toastId);
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("DELETE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while Deleteing Profile";
      toast.error(errorMessage);
    }
    toast.dismiss(toastId);
  };
}
