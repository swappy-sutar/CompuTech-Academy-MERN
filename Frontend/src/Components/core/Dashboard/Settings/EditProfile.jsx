import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (data) => {
    // console.log("Form Data - ", data);
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        {/* Profile Information */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-10">
            {/* First Name and Last Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-richblack-300">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                className="w-full rounded-md bg-richblack-600 p-3 text-richblack-5 focus:outline-yellow-50"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
              />
              {errors.firstName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your first name.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-richblack-300">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter last name"
                className="w-full rounded-md bg-richblack-600 p-3 text-richblack-5 focus:outline-yellow-50"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
              />
              {errors.lastName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-10">
            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfbirth" className="text-richblack-300">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfbirth"
                id="dateOfbirth"
                className="w-full rounded-md bg-richblack-600 p-3 text-richblack-5 focus:outline-yellow-50"
                {...register("dateOfbirth", {
                  max: {
                    value: new Date().toISOString().split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })}
                defaultValue={user?.additionalDetails?.dateOfbirth}
              />
              {errors.dateOfbirth && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.dateOfbirth.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className="text-richblack-300">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                className="w-full rounded-md bg-richblack-600 p-3 text-richblack-5 focus:outline-yellow-50"
                {...register("gender", { required: true })}
                defaultValue={user?.additionalDetails?.gender}
              >
                {genders.map((ele, i) => {
                  return (
                    <option key={i} value={ele}>
                      {ele}
                    </option>
                  );
                })}
              </select>
              {errors.gender && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please select your gender.
                </span>
              )}
            </div>
          </div>

          {/* Contact Number and About */}
          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-10">
            <div className="flex flex-col gap-2">
              <label htmlFor="contactNumber" className="text-richblack-300">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                placeholder="Enter Contact Number"
                className="w-full rounded-md bg-richblack-600 p-3 text-richblack-5 focus:outline-yellow-50"
                {...register("contactNumber", {

                  maxLength: { value: 12, message: "Invalid Contact Number" },
                  minLength: { value: 10, message: "Invalid Contact Number" },
                })}
                defaultValue={user?.additionalDetails?.contactNumber}
              />
              {errors.contactNumber && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="about" className="text-richblack-300">
                About
              </label>
              <input
                type="text"
                name="about"
                id="about"
                placeholder="Enter Bio Details"
                className="w-full rounded-md bg-richblack-600 p-3 text-richblack-5 focus:outline-yellow-50"
                {...register("about", { required: false })}
                defaultValue={user?.additionalDetails?.about}
              />
              {errors.about && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your About.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile");
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>
      </form>
    </>
  );
}
