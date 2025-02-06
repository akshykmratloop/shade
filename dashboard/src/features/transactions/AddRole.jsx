import { useState } from "react";
import InputText from "../../components/Input/InputText";

const AddRoleModal = ({ show, onClose }) => {
    const [roleData, setRoleData] = useState({
        name: "",
        description: "",
        status: "",
    });

    const updateFormValue = ({ updateType, value }) => {
        setRoleData((prevState) => ({
            ...prevState,
            [updateType]: value,
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log("Form Data Submitted:", roleData);
        // Placeholder for your submission logic
    };

    if (!show) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Add New Role</h3>
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

                    {/* Status Select */}
                    <div className="form-control mb-4">
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
                    </div>

                    {/* Button to submit */}
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
        </div>
    );
};

export default AddRoleModal;
