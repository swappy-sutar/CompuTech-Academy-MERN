import { useState } from "react";
import { VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../Services/operations/authAPI";
import ConfirmationModal from "../../common/ConfirmationModal";
import SidebarLinks from "./SidebarLinks";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isOpen, setIsOpen] = useState(false); 
  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] w-full items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar Container */}
      <div className="lg:flex lg:h-[calc(100vh-3.5rem)] lg:w-[220px] sm:w-[100px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 lg:py-10 h-auto">
        {/* Mobile Toggle */}
        <div className="flex justify-between px-1 py-2 lg:hidden">
          <h2 className="text-lg font-bold text-richblack-50"></h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-richblack-50"
          >
            {isOpen ? <IoIosClose size={20} /> : <CiMenuKebab size={20} />}
          </button>
        </div>

        {/* Sidebar Links */}
        <div
          className={`flex-col lg:flex ${isOpen ? "flex" : "hidden"} lg:h-full`}
        >
          <div className="flex flex-col">
            {sidebarLinks.map((link) => {
              if (link.type && user?.accountType !== link.type) return null;
              return (
                <SidebarLinks key={link.id} link={link} iconName={link.icon} />
              );
            })}
          </div>

          <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

          <div className="flex flex-col">
            <SidebarLinks
              link={{ name: "Settings", path: "/dashboard/settings" }}
              iconName="VscSettingsGear"
            />
            <button
              onClick={() =>
                setConfirmationModal({
                  text1: "Are you sure?",
                  text2: "You will be logged out of your account.",
                  btn1Text: "Logout",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(logout(navigate)),
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
              className="px-8 py-2 text-sm font-medium text-richblack-300 transition-all duration-200 hover:text-yellow-50"
            >
              <div className="flex items-center gap-x-2">
                <VscSignOut className="text-lg" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
