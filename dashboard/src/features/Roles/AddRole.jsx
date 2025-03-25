import { useEffect, useState, useRef } from "react";
import InputText from "../../components/Input/InputText";
import {
  fetchRoleType,
  fetchPermissionsByRoleType,
  createRole,
  updateRole,
} from "../../app/fetch";
import { toast, ToastContainer } from "react-toastify";
import validator from "../../app/valid";
import updateToasify from "../../app/toastify";
import { X } from "lucide-react";
import CloseModalButton from "../../components/Button/CloseButton";

const AddRoleModal = ({ show, onClose, updateRoles, role }) => {
  const freshObject = {
    name: "",
    selectedRoletype: "",
    roleTypes: [],
    selectedPermissions: [],
    fetchedPermissions: [],
    fetchedRoletype: [],
  }
  const [errorMessageRole, setErrorMessageRole] = useState("");
  const [errorMessageRoleType, setErrorMessageRoleType] = useState("");
  const [errorMessagePermission, setErrorMessagePermission] = useState("");

  const [roleData, setRoleData] = useState(freshObject);


  const modalRef = useRef(null)

  function clearErrorMessage() {
    setErrorMessageRole("");
    setErrorMessageRoleType("");
    setErrorMessagePermission("")
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "Selected Permissions before submission:",
      roleData.selectedPermissions
    );

    console.log(roleData)

    const validation = validator(roleData, {
      name: setErrorMessageRole,
      selectedRoletype: setErrorMessageRoleType,
      selectedPermissions: setErrorMessagePermission
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
      response = await updateRole({ ...rolePayload, id: role.id });
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
        "error",
        2000
      );
    }
  };

  const modalClose = () => {
    onClose()
    setRoleData(freshObject)
    clearErrorMessage()
  }

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

  const updateFormValue = async ({ updateType, value }) => {
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

  useEffect(() => {
    setErrorMessagePermission("")
  }, [roleData.selectedPermissions])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        modalClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  if (!show) return null;
  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30"
      onClick={modalClose} // Clicking anywhere on the overlay will close the modal
    >
      <div className="modal modal-open relative bg-white dark:bg-[#242933] p-6 w-[35rem] min-h-[30rem] rounded-lg shadow-lg flex flex-col justify-start" ref={modalRef}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
      >

        <CloseModalButton onClickClose={modalClose} />
        <h3 className="font-semibold text-2xl w-full">{role ? "Edit Role" : "Add Role"}</h3>

        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col items-start w-full gap-4 h-[420px] justify-between"
        >
          <div className="w-full flex flex-col gap-3">
            <div className="flex justify-center w-full items-center gap-2">
              {/* Name Field */}
              <InputText
                placeholder="Ex. John Doee"
                name="name"
                defaultValue={roleData.name}
                updateType="name"
                containerStyle="mt-4 flex-1"
                labelTitle="Role Name"
                updateFormValue={updateFormValue}
                errorMessage={errorMessageRole}
              />

              {/* Role Type Field */}
              <div className="flex-1 translate-y-1">
                <InputText
                  type="select"
                  name="userRole"
                  placeholder="Select Role"
                  updateType="userRole"
                  labelTitle="Role Type"
                  defaultValue={roleData.selectedRoletype}
                  options={roleData.fetchedRoletype}
                  updateFormValue={(value) => {
                    updateFormValue({ updateType: "userRole", value: value.value });
                  }}
                  errorMessage={errorMessageRoleType}
                />
              </div>
            </div>

            <InputText
              display={!roleData.selectedRoletype}
              type="checkbox"
              name="permissions"
              labelTitle="Permissions"
              updateType="selectedPermissions"
              defaultValue={roleData.selectedPermissions}
              options={roleData.fetchedPermissions}
              updateFormValue={updateFormValue}
              errorMessage={errorMessagePermission}
              errorClass={"-top-6 text-xs gap-1"}
            />
          </div>

          {/* <div className="permissions">
            {roleData.fetchedPermissions.map((permission) => (
              <div key={permission.id} className="permission-card">
                {permission.name}
              </div>
            ))}
          </div> */}

          <div className="modal-action self-end">
            <button type="button" className="rounded-md h-[2.5rem] w-[8rem] px-4 flex-[1] border border-stone-200 text-sm btn-ghost"
              onClick={modalClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md h-[2.5rem] w-[8rem] px-4 text-sm bg-[#25439B] text-[white]"
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
