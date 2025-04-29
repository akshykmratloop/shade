import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getUserById } from "../../app/fetch";
import userIcon from "../../assets/user.png";
import capitalizeWords from "../../app/capitalizeword";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

function UserDetailsModal({ user, show, onClose }) {
  const modalRef = useRef(null);
  const [fetchedUser, setFetchedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  const permissions = [];

  // console.log("fetchedUser", fetchedUser);

  fetchedUser?.roles?.forEach((role) => {
    role.role.permissions.forEach((permission) => {
      permissions.push(permission.permission);
    });
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function getUser() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await getUserById(user.id);
        if (response.statusCode >= 400) {
          throw `Error: status: ${response.statusCode}, type: ${response.errorType}`;
        }
        setTimeout(() => {
          setFetchedUser(response.user);
          setError(false);
        }, 200);
      } catch (err) {
        setError(true);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    }
    getUser();
  }, [user]);

  if (!user) return null;

  function convertToReadable(input) {
    return input
      .toLowerCase() // Convert entire string to lowercase
      .split("_") // Split by underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join with space
  }

  return (
    <Dialog
      open={show}
      onClose={onClose}
      className="relative z-50 font-poppins"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-[600px] customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6 pb-12  ">
          <div
            ref={modalRef}
            className="flex justify-between items-center mb-4"
          >
            <Dialog.Title className="text-lg font-[500] ">
              User Details
            </Dialog.Title>
            <button
              onClick={onClose}
              className="bg-transparent hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full border-none p-2 py-2"
            >
              <XMarkIcon className="w-5" />
            </button>
          </div>
          {loading || error ? (
            <SkeletonLoader />
          ) : (
            <div className="overflow-y-scroll hideScroller max-h-[80vh] ">
              <div className="flex items-center gap-4">
                <img
                  src={user.image || userIcon}
                  alt=""
                  className="w-[4.8rem] h-[4.8rem] rounded-lg"
                />
                <div>
                  <p className="font-medium text-[#101828] dark:text-[white]">
                    {user.name}
                  </p>
                  <p className="text-[gray]">{user.email}</p>
                </div>
              </div>
              <table className="table-auto w-full text-left">
                <thead>
                  <tr>
                    <th colSpan={3} className="pt-4 font-[500]">
                      Personal Details
                    </th>
                  </tr>
                </thead>
                <tbody style={{ borderBottom: "1px solid #E0E0E0" }}>
                  <tr className="font-light text-sm ">
                    <td className="pt-2 pr-[60px] w-[188px]">Name</td>
                    <td className="pt-2">Email</td>
                    <td className="pt-2">Phone</td>
                  </tr>
                  <tr className="font-[400] text-[#101828] dark:text-stone-100 text-sm">
                    <td className="py-2 pb-6">{user.name}</td>
                    <td className="py-2 pb-6">{user.email}</td>
                    <td className="py-2 pb-6">{user.phone}</td>
                  </tr>
                </tbody>
              </table>
              {/* <table className="table-auto w-full text-left">
                <thead>
                  <tr>
                    <th colSpan={3} className="pt-4 font-[500]">
                      Roles & Permissions
                    </th>
                  </tr>
                </thead>
                <tbody style={{borderBottom: "1px solid #E0E0E0"}}>
                  <tr className="font-light text-sm ">
                    <td className="pt-2 pr-[24px] w-[188px]">Roles</td>
                    <td className="pt-2">Permissions</td>
                  </tr>
                  <tr className="font-[400] text-[#101828] dark:text-stone-100 text-sm pb-7 ">
                    <td className="py-2 pb-7 w-[118px]">
                      <div className="flex gap-2 flex-wrap relative">
                        <div className={`flex gap-2 flex-wrap top-[-26.5px]`}>
                          {fetchedUser?.roles?.map((role, i, a) => {
                            let lastElement = i === a.length - 1;
                            return (
                              <span key={role.role.id} className="">
                                {role.role.name}
                                {!lastElement && ","}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="flex items-start py-2">
                      <div className={`flex flex-wrap gap-1`}>
                        {permissions.map((permission, i, a) => {
                          let lastElement = i === a.length - 1;
                          return (
                            <span key={permission.id} className="mr-1">
                              {capitalizeWords(permission.name)}
                              {!lastElement && `, `}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table> */}

              <label className="mb-4 block pt-4 font-[500]">
                {/* <th colSpan={3} className="pt-4 font-[500]"> */}
                Roles & Permissions
                {/* </th> */}
              </label>
              <div className="w-full overflow-hidden">
                <table className="w-full text-left">
                  <thead className="mb-4">
                    <tr className="font-light bg-[#25439B] text-[white] text-[14px] ">
                      <td
                        className="p-3 w-1/3"
                        style={{ borderRadius: "10px 0px 0px 10px" }}
                      >
                        Role
                      </td>
                      <td
                        className="p-3"
                        style={{
                          border: "1px solid grey",
                          borderTop: "none",
                          borderBottom: "none",
                          borderRight: "none",
                          borderRadius: "0px 10px 10px 0px",
                        }}
                      >
                        Permissions
                      </td>
                    </tr>
                  </thead>
                </table>
                <table className="w-full text-left">
                  <tbody className="bg-[#fcfcfc] dark:bg-transparent">
                    {fetchedUser?.roles?.map((role, i) => {
                      // console.log("role", role);

                      return (
                        <tr
                          key={role?.role?.id}
                          className="font-light text-[14px] text-[#101828] dark:text-[#f5f5f4]"
                        >
                          <td className="px-4 py-2 align-top dark:border dark:border-[#232d3d] w-1/3">
                            <div className="h-full">
                              <span className="font-[500] relative  inline-flex items-center before:content-['•'] before:text-stone-800 before:mr-2">
                                {capitalizeWords(role?.role?.name)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2 dark:border dark:border-[#232d3d] ">
                            {role?.role?.permissions.map((permission, i, a) => {
                              const lastElement = i === a.length - 1;
                              return (
                                <span
                                  key={permission.id}
                                  className="relative pl-2 inline-flex items-center before:content-['•'] before:text-stone-800 before:mr-2"
                                >
                                  {capitalizeWords(permission?.permission?.name)}
                                  {!lastElement && (
                                    <span className="font-[500] px-1">,</span>
                                  )}
                                </span>
                              );
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <label className="mb-4 block pt-4 font-[500]">
                {/* <th colSpan={3} className="pt-4 font-[500]"> */}
                Associated Resources
                {/* </th> */}
              </label>
              <div className="w-full overflow-hidden">
                <table className="w-full text-left">
                  <thead className="mb-4">
                    <tr className="font-light bg-[#25439B] text-[white] text-[14px] ">
                      <td
                        className="p-3 w-1/3"
                        style={{ borderRadius: "10px 0px 0px 10px" }}
                      >
                        Resources Name
                      </td>
                      <td
                        className="p-3 w-1/3"
                        style={{
                          border: "1px solid grey",
                          borderTop: "none",
                          borderBottom: "none",
                          borderRight: "none",
                        }}
                      >
                        Resources Type
                      </td>
                      <td
                        className="p-3 w-1/3"
                        style={{
                          border: "1px solid grey",
                          borderTop: "none",
                          borderBottom: "none",
                          borderRight: "none",
                          borderRadius: "0px 10px 10px 0px",
                        }}
                      >
                        Role
                      </td>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="w-full">
                <table className="w-full text-left">
                  <tbody className="bg-[#fcfcfc] dark:bg-transparent">
                    {(!fetchedUser?.resourceVerifiers ||
                      fetchedUser?.resourceVerifiers?.length === 0) &&
                      fetchedUser?.resourceRoles?.map(
                        (resRol) => (
                          console.log("resRol", resRol),
                          (
                            <tr
                              key={resRol?.resource?.titleEn}
                              className="font-light text-[14px] text-[#101828] dark:text-[#f5f5f4]"
                            >
                              <td className="px-4 py-2 dark:border dark:border-[#232d3d] w-1/3">
                                {resRol?.resource?.titleEn}
                              </td>
                              <td className="px-4 py-2 dark:border dark:border-[#232d3d] w-1/3">
                                {convertToReadable(
                                  resRol?.resource?.resourceType
                                )}{" "}
                                /{" "}
                                {convertToReadable(
                                  resRol?.resource?.resourceTag
                                )}
                              </td>
                              <td className="px-4 py-2 dark:border dark:border-[#232d3d] w-1/3">
                                {convertToReadable(resRol?.role)}
                              </td>
                            </tr>
                          )
                        )
                      )}

                    {fetchedUser?.resourceVerifiers?.length > 0 &&
                      fetchedUser?.resourceVerifiers.map((verifier, idx) => (
                        <tr
                          key={`${verifier?.resource?.title}-${idx}`}
                          className="font-light text-[14px] text-[#101828] dark:text-[#f5f5f4]"
                        >
                          <td className="px-4 py-2 dark:border dark:border-[#232d3d]  w-1/3">
                            {verifier?.resource?.titleEn}
                          </td>
                          <td className="px-4 py-2 dark:border dark:border-[#232d3d]  w-1/3">
                            {convertToReadable(
                              verifier?.resource?.resourceType
                            )}
                          </td>
                          <td className=" px-4 py-2 dark:border dark:border-[#232d3d]  w-1/3">
                            Verifier{" "}
                            <span className="text-[11px] ">
                              {" "}
                              {`(Level ${verifier?.stage})`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {fetchedUser?.resourceVerifiers?.length === 0 &&
                      fetchedUser?.resourceRoles?.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center py-4">
                            No associated resources found.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default UserDetailsModal;
