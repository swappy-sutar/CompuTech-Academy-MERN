import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo/PNG LOGO.png";

function Error() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-300 mb-4">404</h1>
      <p className="text-2xl md:text-3xl font-semibold mb-6">
        Oops! Page Not Found
      </p>
      <p className="text-base md:text-lg text-gray-400 mb-8 text-center max-w-md">
        The page you’re looking for doesn’t exist. It might have been removed or
        you may have mistyped the URL.
      </p>
      <Link
        to="/"
        className="bg-yellow-50 hover:bg-yellow-100 text-black px-6 py-3 rounded-md font-medium text-lg transition duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default Error;
