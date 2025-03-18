import { useEffect, useState } from "react";
import InputText from "../../components/Input/InputText";
import { createRole, updateRole } from "../../app/fetch";
import { toast, ToastContainer } from "react-toastify";
import validator from "../../app/valid";
import updateToasify from "../../app/toastify";

const AddRoleModal = ({ show, onClose, updateRoles, role }) => {
    const [errorMessageRole, setErrorMessageRole] = useState("");
    const [errorMessageDescription, setErrorMessageDescription] = useState("");
    const [roleData, setRoleData] = useState({ // the object handling for role add for input fields
        name: "",
        description: "",
    });

    function clearErrorMessage() {
        setErrorMessageRole("");
        setErrorMessageDescription("");
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // clearing the reloading
        
        const validation = validator(roleData, { name: setErrorMessageRole, description: setErrorMessageDescription });
        if (!validation) {
            return 
        }
        const loadingToastId = toast.loading("Processing request...", { autoClose: 2000 });
        let response;
        if (role) {
            response = await updateRole({ ...roleData, id: role.id });
        } else {
            response = await createRole(roleData);
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
        if (role) {
            setRoleData({
                name: role.name || "",
                description: role.description || "",
            });
        } else {
            setRoleData({ name: "", description: "" });
        }
    }, [role]);

    const updateFormValue = ({ updateType, value }) => {
        clearErrorMessage()
        setRoleData((prevState) => ({
            ...prevState,
            [updateType]: value,
        }));
        console.log(roleData)
    };

    if (!show) return null;

    return (
        <div className="modal modal-open">

            <div className="modal-box p-14 relative flex items-center flex-col gap-6">
                <button className="btn btn-md btn-circle bg-transparent border-none absolute right-2 top-2" onClick={onClose}>✕</button>
                <h3 className="font-bold text-lg">{role ? "Edit Role" : "Add New Role"}</h3>
                <form onSubmit={handleFormSubmit} className="flex flex-col items-center w-[22rem] gap-4">
                    {/* Name Field */}
                    <InputText
                        placeholder="Role Name"
                        name="name"
                        defaultValue={roleData.name}
                        updateType="name"
                        containerStyle="mt-4"
                        labelTitle="Role Name"
                        updateFormValue={updateFormValue}
                        errorMessage={errorMessageRole}
                    />

                    {/* Description Field */}
                    <InputText
                        placeholder="Role Description"
                        name="description"
                        defaultValue={roleData.description}
                        updateType="description"
                        containerStyle="mt-4"
                        labelTitle="Description"
                        updateFormValue={updateFormValue}
                        errorMessage={errorMessageDescription}
                    />

                    <div className="modal-action self-end">
                        <button type="button" className="rounded-md h-[2.5rem] px-4 text-sm btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="rounded-md h-[2.5rem] px-4 text-sm btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
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