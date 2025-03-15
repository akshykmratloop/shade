import { useEffect, useState, useRef } from "react";
import InputText from "../../components/Input/InputText";
import { createRole, updateRole } from "../../app/fetch";
import { toast, ToastContainer } from "react-toastify";
import validator from "../../app/valid";
import updateToasify from "../../app/toastify";
import InputFileForm from "../../components/Input/InputFileForm";
import dummy from "../../assets/MOCK_DATA.json";
import { X } from "lucide-react";

const AddRoleModal = ({ show, onClose, updateRoles, user }) => {
    const [errorMessageRole, setErrorMessageRole] = useState("");
    const [errorMessageDescription, setErrorMessageDescription] = useState("");
    const modalRef = useRef(null);

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        image: "",
        roles: [],
    });

    useEffect(() => {
        if (user?.roles?.length > 0) {
            setUserData((prev) => ({
                ...prev,
                roles: user.roles.map((role) => role.id),
            }));
        }
    }, [user?.roles]);

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                image: user.image || "",
                roles: user.roles?.map((role) => role.id) || [],
            });
        } else {
            setUserData({
                name: "",
                email: "",
                phone: "",
                image: "",
                roles: [],
            });
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const clearErrorMessage = () => {
        setErrorMessageRole("");
        setErrorMessageDescription("");
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const validation = validator(userData, {
            name: setErrorMessageRole,
            description: setErrorMessageDescription,
        });

        if (!validation) return;

        const loadingToastId = toast.loading("Processing request...", { autoClose: 2000 });

        let response;
        if (user) {
            response = await updateRole({ ...userData, id: user.id });
        } else {
            response = await createRole(userData);
        }

        if (response.ok) {
            updateToasify(loadingToastId, `Request successful! 🎉 ${response.message}`, "success", 1000);
            setTimeout(() => {
                onClose();
                updateRoles((prev) => !prev);
            }, 1500);
        } else {
            updateToasify(loadingToastId, `Request failed. ${response.message}`, "failure", 2000);
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        clearErrorMessage();
        setUserData((prevState) => ({
            ...prevState,
            [updateType]: value,
        }));
    };

    if (!show) return null;

    return (
        <div className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div ref={modalRef} className="px-[3.3rem] py-[2.45rem] relative flex flex-col gap-6 w-[600px] bg-white dark:bg-gray-800 rounded-md">
                <button className="bg-transparent hover:bg-stone-300 rounded-full border-none absolute right-4 top-4 p-2 py-2" onClick={onClose}>
                    <X className="w-[20px] h-[20px]" />
                </button>
                <h3 className="font-semibold text-2xl">{user ? "Edit User" : "Add User"}</h3>
                <form onSubmit={handleFormSubmit} className="flex flex-col items-center w-full gap-1">
                    <div className="self-start">
                        <InputFileForm
                            labelStyle="text-[#6B7888]"
                            id="userProfile"
                            label="Profile photo"
                            updater={setUserData}
                            preImage={user?.image}
                        />
                    </div>
                    <div className="w-full flex gap-2">
                        <InputText
                            placeholder="Name"
                            name="name"
                            defaultValue={userData.name}
                            updateType="name"
                            labelTitle="Name"
                            updateFormValue={updateFormValue}
                            errorMessage={errorMessageRole}
                        />
                        <InputText
                            placeholder="Email"
                            name="email"
                            defaultValue={userData.email}
                            updateType="email"
                            labelTitle="Email"
                            updateFormValue={updateFormValue}
                            errorMessage={errorMessageDescription}
                        />
                    </div>
                    <div className="modal-action self-end flex gap-1 w-[200px]">
                        <button type="button" className="rounded-md h-[2.5rem] px-4 flex-[1] border border-stone-200 text-sm btn-ghost" onClick={onClose}>
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

export default AddRoleModal;
