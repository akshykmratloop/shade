import { useEffect, useState } from "react";
import InputText from "../../components/Input/InputText";
import { createRole, updateRole } from "../../app/fetch";
import { toast, ToastContainer } from "react-toastify";
import validator from "../../app/valid";
import updateToasify from "../../app/toastify";
import InputFileForm from "../../components/Input/InputFileForm";
import dummy from "../../assets/MOCK_DATA.json"

const AddRoleModal = ({ show, onClose, updateRoles, user }) => {
    const [errorMessageRole, setErrorMessageRole] = useState("");
    const [errorMessageDescription, setErrorMessageDescription] = useState("");
    const [userData, setUserData] = useState({ // the object handling for role add for input fields
        name: "",
        email: "",
        phone: "",
        image: "",
        roles: []
    });

    // const [roles, setRoles] = useState([])

    function clearErrorMessage() {
        setErrorMessageRole("");
        setErrorMessageDescription("");
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // clearing the reloading

        const validation = validator(userData, { name: setErrorMessageRole, description: setErrorMessageDescription });
        if (!validation) {
            return
        }
        const loadingToastId = toast.loading("Processing request...", { autoClose: 2000 });
        let response;
        if (user) {
            response = await updateRole({ ...userData, id: user.id });
        } else {
            response = await createRole(userData);
        }

        if (response.ok) {
            updateToasify(loadingToastId, `Request successful!🎉. ${response.message}`, "success", 1000);
            setTimeout(() => {
                onClose();
                updateRoles((prev) => !prev);
            }, 1500);
            console.log("reply")
        } else {
            updateToasify(loadingToastId, `Request failed. ${response.message}`, "failure", 2000);
        }
    };

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                image: user.image || "",
                roles: user.roles || [],
            });
        } else {
            setUserData({
                name: "",
                email: "",
                phone: "",
                image: "",
                roles: []
            });
        }
    }, [user]);

    const updateFormValue = ({ updateType, value }) => {
        clearErrorMessage()
        setUserData((prevState) => ({
            ...prevState,
            [updateType]: value,
        }));
        console.log(userData)
    };

    if (!show) return null;

    return (
        <div className="modal modal-open">

            <div className="p-[3.4rem] relative flex flex-col gap-6  w-[600px] bg-[white] dark:bg-gray-800 rounded-md ">
                <button className=" btn-circle text-stone-gray bg-none border-none absolute right-2 top-2" onClick={onClose}>✕</button>
                <div className="">

                    <h3 className="font-semibold text-2xl">{user ? "Edit User" : "Add User"}</h3>
                    <form onSubmit={handleFormSubmit} className="flex flex-col items-center w-full gap-1">
                        <InputFileForm
                            labelStyle={'text-[#6B7888]'}
                            id={"userProfile"}
                            label={"Profile photo"}
                            updater={setUserData}
                        />
                        {/* Name Field */}
                        <InputText
                            placeholder="Name"
                            name="name"
                            defaultValue={userData.name}
                            updateType="name"
                            containerStyle=""
                            labelTitle="Name"
                            InputClasses={"border-2 border-[#D0D5DD]"}
                            labelStyle={"text-[#6B7888]"}
                            updateFormValue={updateFormValue}
                            errorMessage={errorMessageRole}
                        />

                        <div className="w-full flex gap-2">
                            <InputText
                                placeholder="Email"
                                name="email"
                                defaultValue={userData.description}
                                updateType="email"
                                containerStyle=""
                                labelTitle="Email"

                                InputClasses={"border-2"}
                                labelStyle={"text-[#6B7888] border-[#D0D5DD]"}
                                updateFormValue={updateFormValue}
                                errorMessage={errorMessageDescription}
                            />
                            <InputText
                                placeholder="Phone"
                                name="phone"
                                defaultValue={userData.description}
                                updateType="phone"
                                containerStyle=""
                                labelTitle="Phone"
                                InputClasses={"border-2"}
                                labelStyle={"text-[#6B7888] border-[#D0D5DD]"}
                                updateFormValue={updateFormValue}
                                errorMessage={errorMessageDescription}
                            />
                        </div>

                        <ul className="flex flex-wrap">
                            {
                                dummy.map(element => {
                                    return (
                                        <li className="flex gap-2 w-[50%] px-1 text-sm" key={element.id}>
                                            <input type="checkbox" name="name" id={element.id}
                                                className="border-2 border-[#D0D5DD] border"
                                                onChange={(e) => {
                                                    setUserData((prevState) => {
                                                        const updatedRoles = e.target.checked
                                                            ? [...prevState.roles, element.id] // Add role if checked
                                                            : prevState.roles.filter((role) => role !== element.id); // Remove role if unchecked

                                                        return { ...prevState, roles: updatedRoles };
                                                    });
                                                }}
                                            />
                                            <label htmlFor={element.id} className=" w-[70%] text-[#6B7888]">{element.name}</label>
                                        </li>
                                    )
                                })
                            }
                        </ul>


                        <div className="modal-action self-end flex gap-1 w-[200px]">
                            <button type="button" className="rounded-md h-[2.5rem] px-4 flex-[1] border border-stone-200 text-sm btn-ghost" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="rounded-md h-[2.5rem] px-4 flex-[1] text-sm bg-[#25439B] text-[white]">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddRoleModal;

































{/* Status Select*/ }
{/* <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Status</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={roleData.status}
                            onChange={(e) => updateFormValue({ updateType: "status", value: e.target.value })}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div> */}