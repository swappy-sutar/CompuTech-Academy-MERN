import React from "react";
import toast from "react-hot-toast";
import { apiConnector } from "../ApiConnector";
import { catalogData } from "../api";

const getCatlogPageData = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }

    result = response.data;
  } catch (error) {
    console.error("Error catalog page data", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

export default getCatlogPageData;
