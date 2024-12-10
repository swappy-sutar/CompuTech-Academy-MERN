import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { formattedDate } from "../../../utils/dateFormatter.js";
import IconBtn from "../../common/IconBtn";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  // console.log("user", user);
  // console.log("user.image", user.image);
  return (
    <>
      <h1 className="mb-14 text-4xl font-semibold text-richblack-300">
        My Profile
      </h1>

      <div className="relative flex flex-col items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12  md:flex-row md:items-center md:gap-x-4">
        {/* Image Row */}
        <div className="flex flex-col items-center gap-x-4 mt-10 lg:mt-0 md:flex-row">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover mb-4 md:mb-0"
          />
          <div className="space-y-1 text-center md:text-left">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>

        {/* Edit Button */}
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings");
          }}
          customClasses="absolute top-4 right-4 md:static md:mt-0"
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 lg:p-10 lg:px-12 md:flex-row md:gap-x-10 md:p-8 relative">
        {/* About Title and Information */}
        <div className="flex flex-col w-full gap-y-4 md:flex-col md:items-start md:gap-y-2 md:justify-start">
          <p className="text-lg font-semibold text-richblack-5 text-center">
            About
          </p>

          <p
            className={`${
              user?.additionalDetails?.about
                ? "text-richblack-300"
                : "text-richblack-400"
            } text-sm font-medium`}
          >
            {user?.additionalDetails?.about ?? "Write Something About Yourself"}
          </p>
        </div>

        {/* Edit Button */}
        {/* <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings");
          }}
          customClasses="absolute top-4 right-4 md:static md:mt-0 px-2 py-1 rounded-md w-20 h-10 lg:h-12 lg:w-24 lg:text-sm flex items-center justify-center"
        >
          <RiEditBoxLine />
        </IconBtn> */}
      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 relative">
        {/* Personal Details*/}
        <div className="flex w-full items-center">
          <p className="text-lg font-semibold text-richblack-5 mx-auto md:mx-0 md:text-left text-center">
            Personal Details
          </p>
        </div>

        {/* Edit Button in the Top Right */}
        {/* <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings");
          }}
          customClasses="absolute top-4 right-4 lg:mt-5 lg:mr-8"
        >
          <RiEditBoxLine />
        </IconBtn> */}

        {/* Details Section */}
        <div className="flex flex-col md:flex-row md:max-w-none max-w-full gap-y-6 md:gap-y-0 justify-between">
          {/* Column 1 */}
          <div className="flex flex-col gap-y-5 w-full">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-y-5 w-full">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfbirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
