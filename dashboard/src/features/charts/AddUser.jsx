import { useEffect, useRef, useState } from "react";
import InputText from "../../components/Input/InputText";
import { createRole, updateRole } from "../../app/fetch";
import { toast, ToastContainer } from "react-toastify";
import validator from "../../app/valid";
import updateToasify from "../../app/toastify";
import InputFileForm from "../../components/Input/InputFileForm";
import dummy from "../../assets/MOCK_DATA.json";
import { X } from "lucide-react";
import { checkRegex } from "../../app/emailregex";
import PasswordValidation from "../user/components/PasswordValidation";


const AddUserModal = ({ show, onClose, updateRoles, user }) => {
    const [errorMessageName, setErrorMessageName] = useState("");
    const [errorMessageEmail, setErrorMessageEmail] = useState("");
    const [errorMessagePhone, setErrorMessagePhone] = useState("");
    const [errorMessageRoles, setErrorMessageRoles] = useState("");
    const [errorMessagePassword, setErrorMessagePassword] = useState("");
    const modalRef = useRef(null)
    const initialUserState = {
        name: "",
        email: "",
        phone: "",
        password: "",
        // image: "",
        roles: [],
    }

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
        setErrorMessagePassword("")
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const validation = validator(userData, {
            name: setErrorMessageName,
            email: setErrorMessageEmail,
            phone: setErrorMessagePhone,
            roles: setErrorMessageRoles,
            password: setErrorMessagePassword
        });

        const validEmail = checkRegex(userData.email, setErrorMessageEmail) // checks if email is under valid format

        if (!validation) return;
        if (validEmail) return;
        console.log("here")

        const loadingToastId = toast.loading("Processing request...", { autoClose: 2000 });

        let response;
        if (user) {
            // response = await updateRole({ ...userData, id: user.id });
        } else {
            // response = await createRole(userData);
        }

        if (response?.ok) {
            updateToasify(loadingToastId, `Request successful! 🎉 ${response.message}`, "success", 1000);
            setTimeout(() => {
                onClose();
                updateRoles((prev) => !prev);
            }, 1500);
        } else {
            updateToasify(loadingToastId, `Request failed. ${response?.message ? response.message : "Something went wrong please try again later"}`, "failure", 2000);
        }
    };

    const onCloseModal = () => {
        clearErrorMessage()
        setUserData(initialUserState)
        onClose()
    }

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
        <div className="modal modal-open">
            <div ref={modalRef} className="px-[3.3rem] py-[2.45rem] relative flex flex-col gap-6 w-[600px] bg-white dark:bg-gray-800 rounded-md">
                <button className="bg-transparent hover:bg-stone-300 rounded-full border-none absolute right-4 top-4 p-2 py-2"
                    onClick={onClose}>
                    <X className="w-[20px] h-[20px]" />
                </button>
                <h3 className="font-semibold text-2xl">{user ? "Edit User" : "Add User"}</h3>
                <form onSubmit={handleFormSubmit} className="flex flex-col items-center w-full gap-7    ">
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
                            />
                            <PasswordValidation new_password={userData.password} display={""} />
                        </div>
                    </div>

                    <div>
                        <label className="label-text text-[#6B7888]">Select Role</label>
                        <ul className="flex flex-wrap mt-2">
                            {dummy.map((element) => {
                                const isAvailable = userData.roles.includes(element.id);

                                return (
                                    <li className="flex gap-2 w-[50%] px-1 text-[12px]" key={element.id}>
                                        <input
                                            type="checkbox"
                                            id={element.id}
                                            checked={isAvailable}
                                            className="border-2 border-[#D0D5DD]"
                                            onChange={(e) => {
                                                setUserData((prevState) => {
                                                    const updatedRoles = e.target.checked
                                                        ? [...prevState.roles, element.id]
                                                        : prevState.roles.filter((role) => role !== element.id);
                                                    return { ...prevState, roles: updatedRoles };
                                                });
                                            }}
                                        />
                                        <label htmlFor={element.id} className="w-[70%] text-[#6B7888]">
                                            {element.name}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="modal-action self-end flex gap-1 w-[200px]">
                        <button type="button" className="rounded-md h-[2.5rem] px-4 flex-[1] border border-stone-200 text-sm btn-ghost"
                            onClick={onCloseModal}>
                            Cancel
                        </button>
                        <button type="submit" className="rounded-md h-[2.5rem] px-4 flex-[1] text-sm bg-[#25439B] text-white">
                            Save
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddUserModal;