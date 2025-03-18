import {useEffect, useState} from "react";
import InputText from "../../components/Input/InputText";
import {
  fetchRoleType,
  fetchPermissionsByRoleType,
  createRole,
  updateRole,
} from "../../app/fetch";
import {toast, ToastContainer} from "react-toastify";
import validator from "../../app/valid";
import updateToasify from "../../app/toastify";

const AddRoleModal = ({show, onClose, updateRoles, role}) => {
  const [errorMessageRole, setErrorMessageRole] = useState("");
  const [errorMessageDescription, setErrorMessageDescription] = useState("");
  const [roleData, setRoleData] = useState({
    name: "",
    selectedRoletype: "",
    roleTypes: [],
    selectedPermissions: [],
    fetchedPermissions: [],
    fetchedRoletype: [],
  });

  function clearErrorMessage() {
    setErrorMessageRole("");
    setErrorMessageDescription("");
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "Selected Permissions before submission:",
      roleData.selectedPermissions
    );

    const validation = validator(roleData, {
      name: setErrorMessageRole,
      description: setErrorMessageDescription,
    });
    if (!validation) return;

    const loadingToastId = toast.loading("Processing request...", {
      autoClose: 2000,
    });

    const rolePayload = {
      name: roleData.name,
      roleTypeId: roleData.selectedRoletype,
      permissions: roleData.selectedPermissions, // Ensure this holds the correct values
    };

    console.log("Payload being sent:", rolePayload);

    let response;
    if (role) {
      response = await updateRole({...rolePayload, id: role.id});
    } else {
      response = await createRole(rolePayload);
    }

    if (response.ok) {
      updateToasify(
        loadingToastId,
        `Request successful!🎉. ${response.message}`,
        "success",
        1000
      );
      setTimeout(() => {
        onClose();
        updateRoles((prev) => !prev);
      }, 1500);
    } else {
      updateToasify(
        loadingToastId,
        `Request failed. ${response.message}`,
        "failure",
        2000
      );
    }
  };

  useEffect(() => {
    async function fetchRoleTypeData() {
      const response = await fetchRoleType();
      if (response.ok) {
        setRoleData((preData) => ({
          ...preData,
          fetchedRoletype: response.roleType.map((role) => ({
            value: role.id,
            label: role.name,
          })),
        }));
      }
    }
    fetchRoleTypeData();
  }, [roleData.selectedRoletype]);

  //   useEffect(() => {}, []);

  const updateFormValue = async ({updateType, value}) => {
    clearErrorMessage();
    setRoleData((prevState) => ({
      ...prevState,
      [updateType]: updateType === "selectedPermissions" ? [...value] : value,
    }));

    if (updateType === "userRole") {
      console.log("Fetching permissions for Role ID:", value);
      setRoleData((prevState) => ({
        ...prevState,
        selectedRoletype: value, // Store selected roleTypeId
      }));
      try {
        const response = await fetchPermissionsByRoleType(value);
        if (response.ok) {
          setRoleData((prevState) => ({
            ...prevState,
            fetchedPermissions: response.permission, // Store fetched permissions
            selectedPermissions: [], // Ensure this gets reset properly
          }));
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  //   const updateFormValue = async ({value}) => {
  //     try {
  //       const response = await fetchPermissionsByRoleType(value);
  //       setRoleData({q
  //         ...roleData,
  //         fetchedPermissions: response.permission,
  //       });
  //       console.log(roleData, "res");
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  const handleSelectRoleType = async (value) => {
    console.log(value.value, "selectedR");
    try {
      const response = await fetchPermissionsByRoleType(value.value);
      setRoleData({
        ...roleData,
        fetchedPermissions: response.permission,
      });
    } catch (e) {
      console.log(e);
    }
  };

  console.log(roleData, "permissions");
  if (!show) return null;

  console.log("selectedpermissions", roleData);
  return (
    <div className="modal modal-open">
      <div className="modal-box !max-w-[45rem] p-14 relative flex items-start flex-col gap-6">
        <button
          className="btn btn-md btn-circle bg-transparent border-none absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">
          {role ? "Edit Role" : "Add New Role"}
        </h3>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col items-start w-full gap-4"
        >
          {/* Name Field */}
          <InputText
            placeholder="Ex. John Doee"
            name="name"
            defaultValue={roleData.name}
            updateType="name"
            containerStyle="mt-4"
            labelTitle="Role Name"
            updateFormValue={updateFormValue}
            errorMessage={errorMessageRole}
          />

          {/* Role Type Field */}
          <InputText
            type="select"
            name="userRole"
            placeholder="Select Role"
            updateType="userRole"
            labelTitle="Role Type"
            defaultValue={roleData.selectedRoletype}
            options={roleData.fetchedRoletype}
            updateFormValue={(value) => {
              updateFormValue({updateType: "userRole", value: value.value});
            }}
            errorMessage={errorMessageRole}
          />

          <InputText
            type="checkbox"
            name="permissions"
            labelTitle="Permissions"
            updateType="selectedPermissions"
            defaultValue={roleData.selectedPermissions}
            options={roleData.fetchedPermissions}
            updateFormValue={updateFormValue}
            errorMessage={errorMessageRole}
          />

          {/* <div className="permissions">
            {roleData.fetchedPermissions.map((permission) => (
              <div key={permission.id} className="permission-card">
                {permission.name}
              </div>
            ))}
          </div> */}

          <div className="modal-action self-end">
            <button
              type="button"
              className="rounded-md h-[2.5rem] px-4 text-sm btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md h-[2.5rem]  px-4 text-sm bg-[#25439B] text-[white]"
            >
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

{
  /* Status Select*/
}
{
  /* <div className="form-control mb-4">
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
                    </div> */
}
