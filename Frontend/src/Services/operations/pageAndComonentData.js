import React from "react";
import toast from "react-hot-toast";
import { apiConnector } from "../ApiConnector";
import { catalogData } from "../api";

const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
    console.log("running in getCatalogPageData");

  console.log("categoryId", categoryId);
  
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    );
    console.log("response of CATALOGPAGEDATA_API: ", response);

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

export default getCatalogPageData;
