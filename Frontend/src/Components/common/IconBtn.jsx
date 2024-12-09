import React from "react";

function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses = "",
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center justify-center ${
        outline
          ? "border border-yellow-50 bg-transparent"
          : "bg-yellow-50 hover:bg-yellow-100"
      } cursor-pointer gap-x-2 rounded-md py-2 px-4 font-semibold text-richblack-900 
      ${outline ? "hover:border-yellow-100" : "hover:shadow-lg"} 
      transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 
      ${customClasses}
      sm:px-3 sm:py-2 sm:text-sm lg:px-5 lg:py-3 lg:text-base`}
      type={type}
    >
      {children ? (
        <>
          <span
            className={`${
              outline ? "text-yellow-50 hover:text-yellow-100" : ""
            }`}
          >
            {text}
          </span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}

export default IconBtn;
