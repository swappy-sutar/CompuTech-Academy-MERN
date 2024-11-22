import React, { useState, useEffect } from "react";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { apiConnector } from "../../Services/ApiConnector";
import { categories } from "../../Services/api";
import { FaAngleDown } from "react-icons/fa6";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import ProfileDropdown from "../core/Auth/ProfileDropdown";

function Navbar() {

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const [subLinks, setSubLinks] = useState([]);

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      console.log(" categories result", result);

      setSubLinks(result.data.data);
    } catch (error) {
      console.error("Could not fetch the category list", error);
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ">
      <div className="w-11/12 flex items-center max-w-maxContent justify-between">
        {/* logo */}
        <Link to={"/"}>
          <img src={logo} alt="logo" width={160} height={42} loading="lazy" />
        </Link>

        {/* nav links */}
        <nav className="items-center">
          <ul className="flex gap-x-6 text-richblack-25 ">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div className="relative flex flex-row gap-2 items-center group">
                      <p className="text-richblack-300">{link.title}</p>
                      <FaAngleDown />

                      <div className="invisible z-10 absolute left-[50%] translate-x-[-50%] translate-y-[20%] top-[50%] flex flex-col rounded-md bg-richblack-400 p-4 text-richblack-900  opacity-0 transition-all duration-200 group-hover:visible  group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 translate-x-[80%] translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-400"></div>

                        {subLinks.length ? (
                          subLinks.map((subLink, index) => (
                            <Link
                              className="flex flex-row items-center gap-2   hover:text-richblack-600"
                              to={`/catalog/${subLink.name}`}
                              key={index}
                            >
                              <p>{index + 1}.</p>
                              <p className=" ">{subLink.name}</p>
                            </Link>
                          ))
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={` ${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-300"
                        }  `}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* login signup dashbord */}
        <div className="flex gap-x-4 items-center  ">
          {user && user?.accountType != "Instructor" && (
            <Link to={"/dashboard/cart"} className="relative">
              <IoCartOutline />
              {totalItems > 0 && <span className="">{totalItems}</span>}
            </Link>
          )}
          {token === null && (
            <Link to={"/login"}>
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-xl ">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to={"/signup"}>
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-xl ">
                Sign Up
              </button>
            </Link>
          )}
          {token === null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
