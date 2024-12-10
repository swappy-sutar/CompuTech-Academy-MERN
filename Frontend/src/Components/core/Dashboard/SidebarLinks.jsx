import React from "react";
import * as Icons from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import { resetCourseState } from "../../../Slices/Course.slice.js";

function SidebarLinks({ link, iconName }) {
  const Icon = Icons[iconName];
  const location = useLocation();
  const dispatch = useDispatch();

  const matchRoute = (route) => {
    return matchPath(route, location.pathname);
  };

  return (
    <Link
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`relative px-4 py-2 text-sm font-medium 
        ${
          matchRoute(link.path)
            ? "bg-yellow-800 text-yellow-50"
            : "bg-opacity-0 text-richblack-300"
        } transition-all duration-200 hover:text-yellow-50 lg:px-8 lg:py-2`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 
          ${matchRoute(link.path) ? "opacity-100" : "opacity-0"} lg:h-full`}
      ></span>
      <div className="flex items-center gap-x-2">
        <Icon className="text-lg lg:text-xl" />
        <span className="text-xs lg:text-sm">{link.name}</span>
      </div>
    </Link>
  );
}

export default SidebarLinks;
