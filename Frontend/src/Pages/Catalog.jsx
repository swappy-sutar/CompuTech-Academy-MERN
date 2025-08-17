import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../Services/apiConnector.js";
import { categoriesEndpoint } from "../Services/api";
import getCatalogPageData from "../Services/operations/pageAndComonentData";
import Error from "./Error";
import Course_Slider from "../Components/core/Catalog/Course_Slider";
import Course_Card from "../Components/core/Catalog/Course_Card";
import Footer from "../Components/common/Footer";

function Catalog() {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiConnector(
          "GET",
          categoriesEndpoint.CATEGORIES_API
        );

        const categories = res?.data?.data;

        if (!categories || !Array.isArray(categories)) {
          throw new Error("Invalid categories data");
        }

        // Decode the catalogName from the route and normalize it
        const normalizedCatalogName = decodeURIComponent(catalogName)
          .trim()
          .toLowerCase();

        // Find the category with a trimmed name matching the catalogName
        const matchedCategory = categories.find(
          (category) =>
            category.name.trim().toLowerCase() === normalizedCatalogName
        );

        if (matchedCategory) {
          setCategoryId(matchedCategory._id);
        } else {
          console.error(`No matching category found for: ${catalogName}`);
        }
      } catch (error) {
        console.error("Could not fetch Categories:", error);
      }
    })();
  }, [catalogName]);

  useEffect(() => {
    if (categoryId) {
      (async () => {
        try {
          const res = await getCatalogPageData(categoryId);
          setCatalogPageData(res);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [categoryId]);

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  if (!loading && !catalogPageData.success) {
    return <Error />;
  }
  return (
    <>
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl font-semibold text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-5  lg:max-w-maxContent">
        <div className="section_heading text-4xl font-semibold text-richblack-300">
          Courses to get you started
        </div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Populer
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div className="mb-6">
          <Course_Slider
            Courses={catalogPageData?.data?.selectedCategory?.course}
          />
        </div>
        <hr className="text-richblack-5" />
      </div>
      {/* Section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4  lg:max-w-maxContent">
        <div className="section_heading text-4xl font-semibold text-richblack-300">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-8">
          <Course_Slider
            Courses={catalogPageData?.data?.differentCategory?.course}
          />
        </div>
        <hr className="text-richblack-5" />
      </div>
      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab py-12 lg:max-w-maxContent">
        <div className=" text-4xl font-semibold text-richblack-300">
          Most Selling Courses
        </div>
        <div className="my-4">
          <div className="grid grid-cols-2 gap-3 lg:gap-6 lg:grid-cols-2">
            {console.log(
              "catalogPageData?.data?.mostSellingCourse",
              catalogPageData?.data?.mostSellingCourses
            )}
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <Course_Card
                  course={course}
                  key={i}
                  Height={"sm:h-[100px] md:h-[200px] lg:h-[250px] xl:h-[300px]"}
                />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Catalog;
