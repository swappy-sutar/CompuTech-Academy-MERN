import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";
import { IoMdMailUnread } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import Loader from "../Components/common/Loader";


function ForgotPassword() {
  const { loading } = useSelector((state) => state.auth);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const onHandleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8  text-white">
      <div className="w-full max-w-md  p-6 rounded-lg shadow-lg">
        {loading ? (
          <Loader/>
        ) : (
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-richblack-5 mb-4">
              {!emailSent ? (
                <span className="flex items-center gap-2">
                  Reset Your Password
                  <RiLockPasswordLine />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Check Your Email
                  <IoMdMailUnread />
                </span>
              )}
            </h1>
            <p className="text-sm md:text-base text-richblack-400 mb-6">
              {!emailSent
                ? "We’ll email you instructions to reset your password. If you don't have access to your email, we can try account recovery."
                : `We have sent the reset email to ${email}`}
            </p>
            <form onSubmit={onHandleOnSubmit} className="flex flex-col gap-y-4">
              {!emailSent && (
                <label className="text-sm font-medium">
                  <p className="text-base text-white">Email:</p>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    className="w-full mt-2 rounded-md bg-richblack-700 p-3 text-richblack-100 outline-none focus:border-white border border-transparent focus:ring-2 focus:ring-white"
                  />
                </label>
              )}

              <button
                type="submit"
                className="w-full mt-4 bg-yellow-50 text-richblack-900 rounded-md p-3 font-bold transition-colors duration-200 "
              >
                {!emailSent ? "Reset Password " : "Resend Email"}
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

export default ForgotPassword;
