import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../Slices/Auth.slice.js";
import { resetCart } from "../../slices/Cart.Slice.js";
import { setUser } from "../../slices//Profile.slice.js";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../api";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    // Show loading toast
    const toastId = toast.loading("Sending OTP...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      console.log("SENDOTP API RESPONSE............", response);

      if (!response.data.success) {
        const errorMessage =
          response.data.message || "Failed to send OTP. Please try again.";
        console.log("Error message from API:", errorMessage);

        toast.error(errorMessage, { id: toastId });
        throw new Error(errorMessage);
      }

      toast.success("OTP sent successfully! Redirecting...", { id: toastId });
      navigate("/verify-email");
    } catch (error) {
      console.error("SENDOTP API ERROR............", error);

      const errorMessage = error.response?.data?.message || "Could not send OTP. Please try again.";
      console.log("errorMessage", errorMessage);
      
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function signUp(
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  accountType,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Verifying your OTP...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType: accountType,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        otp: otp,
      });
   
      
      console.log("SIGNUP API RESPONSE............", response);


      toast.success(response.data.message);
      navigate("/login");

    } catch (error) {
      console.error("SIGNUP API ERROR............", error);

      const errorMessage = error.response?.data?.message || "Unable to create account. Please try again.";

      toast.error(errorMessage);
      
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {

    dispatch(setLoading(true));
    const toastId = toast.loading("Sending reset email...");

    try {

      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if (!response.data.success) {
        const errorMessage = response.data.message || "Failed to send reset email";
        console.log("Error message from API:", errorMessage);

        toast.error(errorMessage, { id: toastId });

        throw new Error(errorMessage);
      }

      toast.success("Reset email sent successfully", { id: toastId });
      setEmailSent(true);
    } catch (error) {
      console.error("RESET PASSWORD TOKEN Error:", error);

      const errorMessage = error.response?.data?.message || "Failed to send email for resetting password";
      toast.error(errorMessage, { id: toastId });
    } finally {
      dispatch(setLoading(false));
    }
  };
}


export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESET Password RESPONSE ... ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  };
}
