import { useEffect, useState } from "react";
import InputText from "../../components/Input/InputText";
import { createRole, updateRole } from "../../app/fetch";
import { toast, ToastContainer } from "react-toastify";
import validator from "../../app/valid";
import updateToasify from "../../app/toastify";

const AddRoleModal = ({ show, onClose, updateRole, role }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [roleData, setRoleData] = useState({
        name: "",
        description: "",
    });



    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading("Processing request...", { autoClose: 2000 });

        const validation = validator(roleData, setErrorMessage);
        if (!validation) return updateToasify(loadingToastId, "Request failed!", "failure", 1700);

        let response;
        if (role) {
            response = await updateRole({ ...roleData, id: role.id });
        } else {
            response = await createRole(roleData);
        }

        if (response.ok) {
            updateToasify(loadingToastId, "Request successful! 🎉", "success", 1000);
            onClose();
            setTimeout(() => {
                updateRole((prev) => !prev);
            }, 1000);
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
        setErrorMessage("");
        setRoleData((prevState) => ({
            ...prevState,
            [updateType]: value,
        }));
        console.log(roleData)
    };

    if (!show) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{role ? "Edit Role" : "Add New Role"}</h3>
                <form onSubmit={handleFormSubmit}>
                    {/* Name Field */}
                    <InputText
                        placeholder="Role Name"
                        name="name"
                        defaultValue={roleData.name}
                        updateType="name"
                        containerStyle="mt-4"
                        labelTitle="Role Name"
                        updateFormValue={updateFormValue}
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
                    />

                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
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