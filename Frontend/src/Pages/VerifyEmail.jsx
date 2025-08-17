import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoReturnDownBackOutline, IoReload } from "react-icons/io5";
import OTPInput from "react-otp-input";
import { signUp, sendOtp } from "../Services/operations/authAPI";
import Loader from "../Components/common/Loader";

function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { signupData, loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");

 console.log("otp", otp);
 
  const { accountType, firstName, lastName, email, password, confirmPassword } = signupData;

  useEffect(() => {
    if (!signupData) {
      navigate("/signup"); 
    }
  }, [signupData, navigate]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(
      signUp(
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 text-white">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg ">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-richblack-5 mb-4">
              Verify Email
            </h1>
            <p className="text-sm md:text-base text-richblack-400 mb-6">
              A verification code has been sent to your email. Enter the code
              below to verify your account.
            </p>
            <form onSubmit={handleOnSubmit}>
              <div className="flex justify-center gap-2 md:gap-4 lg:gap-6">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => (
                    <input
                      {...props}
                      placeholder="-"
                      style={{
                        boxShadow:
                          "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                      }}
                      className="w-[45px] lg:w-[50px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                    />
                  )}
                  containerStyle={{
                    justifyContent: "space-between",
                    gap: "6px",
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-yellow-50 text-richblack-900 rounded-md p-3 font-bold 
                  transition-colors duration-200 hover:bg-yellow-100"
              >
                Verify Email
              </button>
            </form>
            <div className="mt-6 flex items-center justify-between">
              <Link
                to="/signup"
                className="flex flex-row items-center gap-2 text-richblack-300 hover:text-yellow-25 
                  transition-colors duration-200"
              >
                <IoReturnDownBackOutline className="text-xl" />
                <p className="font-semibold">Back to SignUp</p>
              </Link>

              <button
                onClick={() => dispatch(sendOtp(email))}
                className="flex flex-row items-center gap-2 text-richblack-300 hover:text-yellow-25 
                  transition-colors duration-200"
              >
                <IoReload />
                <p className="font-semibold">Resend it</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
