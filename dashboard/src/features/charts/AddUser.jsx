import { useEffect, useRef, useState } from "react";
import InputText from "../../components/Input/InputText";
import { fetchRoles, createUser, updateUser, getUserById } from "../../app/fetch";
import { toast, ToastContainer } from "react-toastify";
import validator from "../../app/valid";
import updateToastify from "../../app/toastify";
import InputFileForm from "../../components/Input/InputFileForm";
import dummy from "../../assets/MOCK_DATA.json";
import { X } from "lucide-react";
import { checkRegex } from "../../app/emailregex";
import PasswordValidation from "../user/components/PasswordValidation";
import CloseModalButton from "../../components/Button/CloseButton";
import capitalizeWords from "../../app/capitalizeword";
import { useDispatch, useSelector } from "react-redux";
import { switchDebounce } from "../common/debounceSlice";
import ToastPlacer, { runToast } from "../Component/ToastPlacer";
import { PulseLoader } from "react-spinners";


const AddUserModal = ({ show, onClose, updateUsers, user }) => {
  const [errorMessageName, setErrorMessageName] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePhone, setErrorMessagePhone] = useState("");
  const [errorMessageRoles, setErrorMessageRoles] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [fetchedUser, setFetchedUser] = useState({});
  const [roles, setRoles] = useState([]);
  const debouncingState = useSelector((state) => state.debounce.debounce);
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const initialUserState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    // image: "",
    roles: [],
  };

  const [userData, setUserData] = useState(initialUserState);

  useEffect(() => {
    if (user?.roles?.length > 0) {
      setUserData((prev) => ({
        ...prev,
        roles: user.roles.map((role) => role.id),
      }));
    }
  }, [user?.roles]);

  const clearErrorMessage = () => {
    setErrorMessageName("");
    setErrorMessageEmail("");
    setErrorMessagePhone("");
    setErrorMessageRoles("");
    setErrorMessagePassword("");
  };

  const handleFormSubmit = async (e) => { /////////////////////////////////submission
    e.preventDefault();
    if (debouncingState) return;

    const validation = validator(userData, {
      name: setErrorMessageName,
      email: setErrorMessageEmail,
      phone: setErrorMessagePhone,
    });

    const validEmail = checkRegex(userData.email, setErrorMessageEmail); // checks if email is under valid format
    const validPassword = userData.password.trim() === "";
    if (validPassword && !user) {
      setErrorMessagePassword("required");
      return;
    }

    if (!validation) return;
    if (validEmail) return;


    try {
      dispatch(switchDebounce(true));
      runToast("LOAD", "Processing request...")
      let response;
      if (user) {
        const payload = {
          name: userData.name,
          phone: userData.phone,
          roles: userData.roles,
        };
        if (!validPassword) payload.password = userData.password;
        response = await updateUser({ payload, id: user.id });
      } else {
        response = await createUser(userData);
      }

      if (response?.ok) {
        runToast("SUCCESS", `${capitalizeWords(response.message)}!`)
      } else {
        runToast("ERROR", `Request failed. ${response?.message
          ? response.message
          : "Something went wrong please try again later"
          }`)
      }
    } catch (err) {
      console.log(err?.message);
    } finally {
      setTimeout(() => {
        onClose();
        updateUsers((prev) => !prev);
        dispatch(switchDebounce(false));
      }, 1000)

    }
  };

  const onCloseModal = () => { //////////////////closing the modal
    clearErrorMessage();
    setUserData(initialUserState);
    onClose();
  };

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        // image: user.image || "",
        roles: user.roles?.map((role) => role.id) || [],
      });
    } else {
      setUserData(initialUserState);
    }
  }, [user]);

  useEffect(() => {
    async function fetchForForm() {
      const response = await fetchRoles({ limit: 100 });

      setRoles(response?.roles?.roles ?? []);
    }

    fetchForForm();
  }, []);

  useEffect(() => {
    async function getUser() {
      const response = await getUserById(user?.id);
      setFetchedUser(response.user);
      let roles = [];
      response?.user?.roles?.forEach((element) => {
        roles.push(element.role.id);
      });
      setUserData((prev) => ({ ...prev, roles: roles }));
    }
    if (user?.id) {
      getUser();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const updateFormValue = ({ updateType, value }) => {
    clearErrorMessage();
    setUserData((prevState) => ({
      ...prevState,
      [updateType]: value,
    }));
  };

  if (!show) return null;

  return (
    <div className="modal modal-open"
      style={{ zIndex: "50" }}
    >
      <div
        ref={modalRef}
        className="p-[24px] relative flex flex-col justify-between gap-6 w-[600px] bg-white dark:bg-gray-800 rounded-md min-h-[500px] mx-h-[90vh] overflow-y-scroll rm-scroll"
      >
        {/* <button className="bg-transparent hover:bg-stone-300 rounded-full border-none absolute right-4 top-4 p-2 py-2"
                    onClick={onClose}>
                    <X className="w-[20px] h-[20px]" />
                </button> */}
        <CloseModalButton onClickClose={onClose} />
        <form className="flex flex-col items-center w-full gap-7    ">
          <h3 className="font-semibold text-2xl self-start">
            {user ? "Edit User" : "Add User"}
          </h3>
          {/* <div className="self-start">
                        <InputFileForm
                            labelStyle="text-[#6B7888]"
                            id="userProfile"
                            label="Profile photo"
                            updater={setUserData}
                            preImage={user?.image}
                        />
                    </div> */}
          <div className="w-full flex gap-2 ">
            <InputText
              placeholder="Name"
              name="name"
              defaultValue={userData.name}
              updateType="name"
              labelTitle="Name"
              InputClasses="border-stone-400"
              labelStyle="text-[#6B7888]"
              updateFormValue={updateFormValue}
              errorMessage={errorMessageName}
            />
            <InputText
              placeholder="Email"
              name="email"
              defaultValue={userData.email}
              updateType="email"
              labelTitle="Email"
              InputClasses="border-stone-400"
              labelStyle="text-[#6B7888]"
              updateFormValue={updateFormValue}
              disabled={user ? true : false}
              errorMessage={errorMessageEmail}
            />
          </div>
          <div className="w-full flex gap-2">
            <InputText
              placeholder="Phone"
              name="phone"
              defaultValue={userData.phone}
              updateType="phone"
              labelTitle="Phone"
              InputClasses="border-stone-400"
              labelStyle="text-[#6B7888]"
              updateFormValue={updateFormValue}
              errorMessage={errorMessagePhone}
              containerStyle={"flex-1"}
              customType={"number"}
            />
            <div className="flex-1">
              <InputText
                placeholder="Password"
                name="password"
                defaultValue={userData.password}
                updateType="password"
                labelTitle="Password"
                InputClasses="border-stone-400"
                labelStyle="text-[#6B7888]"
                updateFormValue={updateFormValue}
                errorMessage={errorMessagePassword}
                type={"password"}
                required={user ? false : true}
              />
              <PasswordValidation
                new_password={userData.password}
                display={""}
              />
            </div>
          </div>

          {Array.isArray(roles) && roles?.length > 0 ? (
            <div className="self-start w-full">
              <label className="label-text text-[#6B7888]">Select Role</label>
              <ul className="flex flex-wrap mt-2">
                {roles?.map((element) => {
                  const isAvailable = userData.roles.includes(element.id);

                  return (
                    <li
                      className="flex gap-2 w-[50%] px-1 text-[12px]"
                      key={element.id}
                    >
                      <input
                        type="checkbox"
                        id={element.id}
                        checked={isAvailable}
                        className="border-2 border-[#D0D5DD] cursor-pointer"
                        onChange={(e) => {
                          setUserData((prevState) => {
                            const updatedRoles = e.target.checked
                              ? [...prevState.roles, element.id]
                              : prevState.roles.filter(
                                (role) => role !== element.id
                              );
                            return { ...prevState, roles: updatedRoles };
                          });
                        }}
                      />
                      <label
                        htmlFor={element.id}
                        className="w-[70%] text-[#6B7888] cursor-pointer"
                      >
                        {capitalizeWords(element.name)}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="self-start w-full">
              <label className="label-text text-[#6B7888]">Select Role</label>
              <p className="text-sm py-6 text-center">No Roles Found</p>
            </div>
          )}
        </form>
        <div className="mt-4 self-end flex gap-1">
          <button
            type="button"
            className="rounded-md h-[2.5rem] w-[8rem] px-4 flex-[1] border border-stone-200 text-sm btn-ghost"
            onClick={onCloseModal}
          >
            Cancel
          </button>
          <button
            onClick={handleFormSubmit}
            type="submit"
            className="rounded-md h-[2.5rem] w-[8rem] px-4 flex-[1] text-sm bg-[#25439B] text-white"
            disabled={debouncingState}
          >
            {debouncingState ? <span className=""><PulseLoader size={5} color="#fff" /></span> : "Save"}
          </button>
        </div>
      </div>
      {/* <ToastContainer /> */}
      {/* <ToastPlacer /> */}
    </div>
  );
};

export default AddUserModal;
