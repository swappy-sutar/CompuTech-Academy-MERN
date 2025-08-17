import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { resetPassword } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

function UpdatePassword() {
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { password, confirmPassword } = formData;
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleOnchange = (e) => {
    setFormData((prevdata) => ({
      ...prevdata,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token, navigate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 text-white">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        {loading ? (
          <div role="status" className="flex justify-center items-center">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-50"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.803247 41.9202 2.33539"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-richblack-5 mb-4">
              Choose New Password
            </h1>
            <p className="text-sm md:text-base text-richblack-400 mb-6">
              Almost done. Enter your new password and you’re all set.
            </p>
            <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4">
              {/* New Password Field */}
              <label className="text-sm font-medium">
                <p className="text-base text-white">New Password</p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    required
                    value={password}
                    onChange={handleOnchange}
                    placeholder="New password"
                    className="w-full mt-2 rounded-md bg-richblack-700 p-3 text-richblack-100 outline-none focus:border-white border border-transparent focus:ring-2 focus:ring-white pr-10"
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showPassword ? (
                      <IoMdEyeOff fontSize={24} />
                    ) : (
                      <IoMdEye fontSize={24} />
                    )}
                  </span>
                </div>
              </label>

              {/* Confirm Password Field */}
              <label className="text-sm font-medium">
                <p className="text-base text-white">Confirm New Password</p>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={handleOnchange}
                    placeholder="Confirm new password"
                    className="w-full mt-2 rounded-md bg-richblack-700 p-3 text-richblack-100 outline-none focus:border-white border border-transparent focus:ring-2 focus:ring-white pr-10"
                  />
                  <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <IoMdEyeOff fontSize={24} />
                    ) : (
                      <IoMdEye fontSize={24} />
                    )}
                  </span>
                </div>
              </label>

              <button
                type="submit"
                className="w-full mt-4 bg-yellow-50 text-richblack-900 rounded-md p-3 font-bold transition-colors duration-200"
              >
                Reset Password
              </button>
            </form>
            <div className="mt-6 flex items-center justify-center">
              <Link
                to="/login"
                className="flex flex-row items-center gap-2 text-richblack-300 hover:text-yellow-25 transition-colors duration-200"
              >
                <IoReturnDownBackOutline className="text-xl" />
                <p className="font-semibold">Back to Login</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdatePassword;