import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules"; // Import FreeMode
import "swiper/css";
import "swiper/css/pagination";

import Course_Card from "./Course_Card";

function Course_Slider({ Courses }) {
  // Duplicate slides if there are fewer than 3
  const slidesToShow = Courses?.length || 0;
  const duplicateSlides = slidesToShow < 3 ? [...Courses, ...Courses] : Courses;

  return (
    <div className="bg-richblack-700 p-4 rounded-md">
      {Courses?.length ? (
        <Swiper
          slidesPerView={Math.min(3, slidesToShow)} // Adjust slidesPerView dynamically
          spaceBetween={10}
          loop={true}
          pagination={{ clickable: true }}
          freeMode={true} // Enable FreeMode here
          modules={[FreeMode, Pagination]} // Include FreeMode in modules
          className="max-h-[30rem]"
        >
          {duplicateSlides.map((course, i) => (
            <SwiperSlide key={i} className="mb-6">
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </div>
  );
}

export default Course_Slider;
