import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../../data/countrycode.json";
import { apiConnector } from "../../Services/apiConnector.js";
import { contactusEndpoint } from "../../Services/api";
import { toast } from "react-hot-toast";

const ContactUsForm = () => {
  const [searchTerm, setSearchTerm] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCountryCodes = CountryCode.filter(
    (ele) =>
      ele.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ele.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        message: "",
      });
      setSearchTerm("+91");
    }
  }, [reset, isSubmitSuccessful]);

 const submitContactForm = async (data) => {
   try {
     setLoading(true);

     const countryCode = searchTerm.split(" - ")[0];

     const fullPhoneNumber = `${countryCode}-${data.phoneNumber}`;

     const formData = {
       ...data,
       phoneNumber: fullPhoneNumber,
     };

     const res = await apiConnector(
       "POST",
       contactusEndpoint.CONTACT_US_API,
       formData
     );

     toast.success("Message sent");
     reset();
   } catch (error) {
     console.error("ERROR MESSAGE - ", error.message);
     toast.error("Failed to send the message. Please try again.");
   } finally {
     setLoading(false);
   }
 };


  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      {/* First Name and Last Name */}
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstName" className="label-style">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Enter first name"
            className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50"
            {...register("firstName", {
              required: "First name is required.",
            })}
          />
          {errors.firstName && (
            <span className="text-[12px] text-yellow-100">
              {errors.firstName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastName" className="label-style">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Enter last name"
            className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50"
            {...register("lastName")}
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="label-style">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50"
          {...register("email", {
            required: "Email Address is required.",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Please enter a valid email address.",
            },
          })}
        />
        {errors.email && (
          <span className="text-[12px] text-yellow-100">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phoneNumber" className="label-style">
          Phone Number
        </label>
        <div className="flex gap-5">
          {/* Searchable Dropdown */}
          <div className="relative w-[150px]">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={(e) => {
                if (!e.relatedTarget?.closest(".dropdown-item")) {
                  setShowDropdown(false);
                }
              }}
            />
            {showDropdown && (
              <div className="absolute z-10 max-h-40 w-full overflow-y-auto rounded-md bg-richblack-700 shadow-md">
                {filteredCountryCodes.map((ele, i) => (
                  <div
                    key={i}
                    className="dropdown-item cursor-pointer p-2 hover:bg-richblack-600"
                    onMouseDown={() => {
                      setSearchTerm(`${ele.code} - ${ele.country}`);
                      setShowDropdown(false);
                    }}
                  >
                    {ele.code} - {ele.country}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="flex-1">
            <input
              type="text"
              id="phoneNumber"
              placeholder="12345 67890"
              className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50"
              {...register("phoneNumber", {
                required: "Phone Number is required.",
                pattern: {
                  value: /^[0-9]{10,12}$/,
                  message: "Invalid Phone Number",
                },
              })}
            />
          </div>
        </div>
        {errors.phoneNumber && (
          <span className="text-[12px] text-yellow-100">
            {errors.phoneNumber.message}
          </span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="label-style">
          Message
        </label>
        <textarea
          id="message"
          rows="7"
          placeholder="Enter your message here"
          className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 focus:outline-yellow-50"
          {...register("message", { required: "Message is required." })}
        />
        {errors.message && (
          <span className="text-[12px] text-yellow-100">
            {errors.message.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black 
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-95"}
          transition-all duration-200 sm:text-[16px]`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactUsForm;
