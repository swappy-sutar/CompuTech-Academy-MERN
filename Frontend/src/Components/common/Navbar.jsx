import React, { useState, useEffect } from "react";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { apiConnector } from "../../Services/apiConnector.js";
import { categoriesEndpoint } from "../../Services/api";
import { FaAngleDown } from "react-icons/fa6";
import logo from "../../assets/Logo/PNG NEW LOGO.png";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector(
        "GET",
        categoriesEndpoint.CATEGORIES_API
      );
      setSubLinks(result.data.data);
    } catch (error) {
      console.error("Could not fetch the category list", error);
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="w-11/12 flex items-center max-w-maxContent justify-between">
        {/* Logo */}
        <Link to={"/"}>
          <img src={logo} alt="logo" width={180} height={52} loading="lazy" />
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <FaTimes className="text-2xl text-richblack-25" />
            ) : (
              <FaBars className="text-2xl text-richblack-25" />
            )}
          </button>
        </div>

        {/* Nav Links */}
        <nav
          className={`absolute top-0 left-0 z-50 w-full flex flex-col items-center justify-center bg-richblack-800 text-white 
            ${
              menuOpen
                ? "block h-[350px] border-b border-blue-5 rounded-b-full"
                : "hidden"
            } md:relative md:flex md:h-auto md:w-auto md:top-auto md:left-auto md:bg-transparent md:border-0 md:rounded-none`}
        >
          {/* Close Button for Mobile */}
          <div className="flex w-full justify-end pt-4 pr-4 md:hidden">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close Menu"
              className="text-2xl text-white"
            >
              <FaTimes />
            </button>
          </div>

          <ul className="flex flex-col items-center gap-6 px-8 pb-16 md:flex-row md:gap-x-6 md:py-0 md:px-0">
            {/* Navbar Links */}
            {NavbarLinks.map((link, index) => (
              <li key={index} className="">
                {link.title === "Catalog" ? (
                  <div className="relative flex flex-row items-center gap-2 group">
                    <p className="text-richblack-300 hover:text-yellow-25 transition-colors duration-300">
                      {link.title}
                    </p>
                    <FaAngleDown />

                    {/* Dropdown */}
                    <div className="invisible absolute left-1/2 top-full z-10 translate-x-[-50%] flex flex-col rounded-md bg-richblack-400 p-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-richblack-400"></div>

                      {subLinks.length ? (
                        subLinks.map((subLink, index) => (
                          <Link
                            className="flex items-center gap-2 hover:text-richblack-600 "
                            to={`/catalog/${subLink.name}`}
                            key={index}
                            onClick={handleLinkClick}
                          >
                            <p>{index + 1}.</p>
                            <p>{subLink.name}</p>
                          </Link>
                        ))
                      ) : (
                        <p>No Categories</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path} onClick={handleLinkClick}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-300"
                      }`}
                    >
                      <p className=" hover:text-yellow-25">{link.title}</p>
                    </p>
                  </Link>
                )}
              </li>
            ))}

            {/* Cart, Login/Signup, and Profile */}
            <li className="flex flex-col items-center gap-6 md:hidden ">
              {user && user?.accountType !== "Instructor" && (
                <Link
                  to={"/dashboard/cart"}
                  className="relative text-xl text-white"
                  onClick={handleLinkClick}
                >
                  <FaShoppingCart />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-25 text-xs text-richblack-900">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              {token === null && (
                <div className="flex flex-row items-center gap-2">
                  <Link to={"/login"} onClick={handleLinkClick}>
                    <button className="rounded-xl border border-white bg-richblack-800 px-[12px] py-[8px] hover:scale-95 transition-all duration-200">
                      Log in
                    </button>
                  </Link>
                  <Link to={"/signup"} onClick={handleLinkClick}>
                    <button className="rounded-xl border border-white bg-richblack-800 px-[12px] py-[8px] hover:scale-95 transition-all duration-200">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
              {token !== null && <ProfileDropdown />}
            </li>
          </ul>
        </nav>

        {/* Login/Signup/Profile (Laptop View) */}
        <div className="hidden md:flex items-center gap-x-4">
          {user && user?.accountType !== "Instructor" && (
            <Link
              to={"/dashboard/cart"}
              className="relative text-xl text-richblack-25"
            >
              <FaShoppingCart className="text-gray-800 hover:text-yellow-25 transition-colors duration-300" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-25 text-xs text-richblack-900">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <>
              <Link to={"/login"}>
                <button className="rounded-xl border border-richblack-700 hover:text-yellow-25 transition-colors duration-300 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="rounded-xl border border-richblack-700 hover:text-yellow-25 transition-colors duration-300 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Sign Up
                </button>
              </Link>
            </>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
