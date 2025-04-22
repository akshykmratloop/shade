import { useEffect, useState, useRef } from "react";
import InputText from "../../components/Input/InputText";
import {
  fetchRoleType,
  fetchPermissionsByRoleType,
  createRole,
  updateRole,
  getRoleById,
} from "../../app/fetch";
import { toast, ToastContainer } from "react-toastify";
import validator from "../../app/valid";
import updateToasify from "../../app/toastify";
import CloseModalButton from "../../components/Button/CloseButton";

const AddRoleModal = ({ show, onClose, updateRoles, role }) => {

  const freshObject = {
    name: "",
    selectedRoletype: "",
    roleTypes: [],
    selectedPermissions: [],
    fetchedPermissions: [],
    fetchedRoletype: [],
  };
  const [errorMessageRole, setErrorMessageRole] = useState("");
  const [errorMessageRoleType, setErrorMessageRoleType] = useState("");
  const [errorMessagePermission, setErrorMessagePermission] = useState("");
  const [PermissionOptions, setPermissionOptions] = useState([])
  const [currentRole, setCurrentRole] = useState({});

  const [roleData, setRoleData] = useState(freshObject);

  const modalRef = useRef(null);

  function clearErrorMessage() {
    setErrorMessageRole("");
    setErrorMessageRoleType("");
    setErrorMessagePermission("");
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validation = validator(roleData, {
      name: setErrorMessageRole,
      selectedRoletype: setErrorMessageRoleType,
      selectedPermissions: setErrorMessagePermission,
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

    let response;
    if (role) {
      response = await updateRole({ rolePayload, id: role?.id });
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
        modalClose();
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

  function modalClose() {
    onClose();
    setRoleData(freshObject);
    clearErrorMessage();
  }

  useEffect(() => {
    async function fetchRoleTypeData() {
      const response = await fetchRoleType();
      if (response.ok) {

        setRoleData((preData) => ({
          ...preData,
          fetchedRoletype: response?.roleType.map((role) => ({
            value: role.id,
            label: role.name,
          })),
          selectedPermissions: role.roleTypeId === roleData.selectedRoletype ? currentRole?.permissions?.map(e => e.permissionId) || [] : []
        }));
      }
    }
    fetchRoleTypeData();
  }, [roleData.selectedRoletype]);

  // function updateSelection(key, value) {
  //   setTimeout(() => {

  //     setPermissionOptions([])
  //   }, 100)
  // }

  const updateFormValue = async ({ updateType, value }) => {
    clearErrorMessage();
    if (updateType !== "selectedPermissions") {
      setRoleData((prevState) => ({
        ...prevState,
        [updateType]: updateType === "selectedPermissions" ? [...value] : value,
      }));
    } else {
      setTimeout(() => {

        setRoleData((prevState) => ({
          ...prevState,
          [updateType]: updateType === "selectedPermissions" ? [...value] : value,
        }));
      }, 100)
    }

    if (updateType === "userRole") {
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

  // const handleSelectRoleType = async (value) => {
  //   try {
  //     const response = await fetchPermissionsByRoleType(value.value);
  //     setRoleData({
  //       ...roleData,
  //       fetchedPermissions: response?.permission,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };


  useEffect(() => {
    if (role) {
      async function getRole() {
        try {
          const response = await getRoleById(role?.id);
          setCurrentRole(response.role)
          const permissions = await fetchPermissionsByRoleType(role?.roleTypeId);
          if (response.ok) {
            setRoleData((prevState) => ({
              ...prevState,
              fetchedPermissions: permissions?.permission, // Store fetched permissions
            }));
          }
        } catch (error) {
          console.log(error);
        }
      }
      getRole();
    }
  }, [role]);

  useEffect(() => {
    if (role) {
      setRoleData({
        name: currentRole?.name || "",
        name: currentRole?.name || "",
        roleTypes: [] || [],
        selectedPermissions: currentRole?.permissions?.map(e => e.permissionId) || [],
        fetchedPermissions: [],
        fetchedRoletype: [],
        selectedRoletype: currentRole?.roleTypeId || "",
        selectedRoletype: currentRole?.roleTypeId || "",
      });
    } else {
      setRoleData(freshObject);
    }
  }, [currentRole]);

  useEffect(() => {
    if (role?.roleTypeId === roleData?.selectedRoletype) {
      setRoleData(prev => {
        return ({ ...prev, selectedPermissions: currentRole?.permissions?.map(e => e.permissionId) || [], })
      });
    }
  }, [roleData.selectedRoletype]);

  useEffect(() => {
    setErrorMessagePermission("");
  }, [roleData.selectedPermissions]);

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
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30"
      onClick={modalClose} // Clicking anywhere on the overlay will close the modal
    >
      <div
        className="modal modal-open relative bg-white dark:bg-[#242933] p-6 w-[35rem] min-h-[30rem] rounded-lg shadow-lg flex flex-col justify-start"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
      >
        <CloseModalButton onClickClose={modalClose} />
        <h3 className="font-semibold text-2xl w-full">
          {role ? "Edit Role" : "Add Role"}
        </h3>

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
                defaultValue={roleData?.name}
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
                  defaultValue={roleData?.selectedRoletype}
                  options={roleData?.fetchedRoletype}
                  updateFormValue={(value) => {
                    updateFormValue({
                      updateType: "userRole",
                      value: value.value,
                    });
                  }}
                  errorMessage={errorMessageRoleType}
                />
              </div>
            </div>

            <InputText
              display={!roleData?.selectedRoletype}
              type="checkbox"
              name="permissions"
              labelTitle="Permissions"
              updateType="selectedPermissions"
              defaultValue={roleData?.selectedPermissions}
              options={roleData?.fetchedPermissions}
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
            <button
              type="button"
              className="rounded-md h-[2.5rem] w-[8rem] px-4 flex-[1] border border-stone-200 text-sm btn-ghost"
              onClick={modalClose}
            >
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
    </div>
  );
};

export default AddRoleModal
