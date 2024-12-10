import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { deleteProfile } from "../../../../services/operations/SettingsAPI";
import ConfirmationModal from "../../../common/ConfirmationModal";

export default function DeleteAccount() {
  const [confirmationModal, setConfirmationModal] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  }

  return (
    <>
      <div className="my-10 flex flex-col items-center gap-y-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12 sm:flex-row sm:gap-x-5 sm:items-start sm:px-16">
        {/* Icon (Center for Mobile) */}
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>

        {/* Text and Button */}
        <div className="flex flex-col space-y-2 text-center sm:text-left sm:w-[60%]">
          {/* Delete Account Title */}
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>

          {/* Information about deletion */}
          <div className="w-full text-pink-25 sm:w-[90%]">
            <p>Would you like to delete your account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the content associated with it.
            </p>
          </div>

          {/* Button to delete account */}
          <button
            type="button"
            className="w-full sm:w-fit cursor-pointer italic text-white bg-pink-500 p-3 rounded-md font-semibold"
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure, you want to delete this account?",
                text2:
                  "This action will permanently delete the account and all associated courses.",
                btn1Text: "Delete",
                btn2Text: "Cancel",
                btn1Handler: () => handleDeleteAccount(),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
          >
            I want to delete my account
          </button>
        </div>
      </div>
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
    </>
  );
}
