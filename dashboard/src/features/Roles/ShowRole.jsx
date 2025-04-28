import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import userIcon from "../../assets/user.png"
import formatTimestamp from "../../app/TimeFormat";
import { getRoleById } from "../../app/fetch";
import capitalizeWords from "../../app/capitalizeword";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";


function RoleDetailsModal({ role, show, onClose }) {
    const [fetchedRole, setFetchedRole] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(true)


    const modalRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            };
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    useEffect(() => {
        async function getRole() {
            if (!role?.id) return;
            setLoading(true);
            try {
                const response = await getRoleById(role.id);
                if (response?.statusCode >= 400 || response instanceof Error) {
                    throw `Error: status: ${response?.statusCode}, type: ${response?.errorType}`
                }
                setTimeout(() => {
                    setFetchedRole(response.role);
                    setError(false);
                }, 200)
            } catch (err) {
                setError(true);
                console.log("catch")
            } finally {
                setTimeout(() => {

                    setLoading(false);
                }, 200)
            }
        }
        getRole();
    }, [role]);

    if (!role) return null;

    return (
        <Dialog open={show} onClose={onClose} className="relative z-50 font-poppins">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div ref={modalRef} className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-[653px] h-[600px] overflow-y-auto customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-[500]">Role Details</Dialog.Title>
                        <button onClick={onClose} className="bg-transparent hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full border-none p-2 py-2">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>

                    {
                        loading || error ? (<SkeletonLoader />
                        ) : (

                            <div className="overflow-x-auto">

                                <table className="table-auto w-full text-left">
                                    <thead>

                                    </thead>
                                    <tbody style={{ borderBottom: "1px solid #E0E0E0 " }}>
                                        <tr className="font-light text-sm ">
                                            <td className="pt-2  w-1/4">Role Name</td>
                                            <td className="pt-2  w-1/4 pl-4">Status</td>
                                            <td className="pt-2  w-1/4">Role Type</td>
                                            <td className="pt-2  w-1/4">Updated At</td>
                                        </tr>
                                        <tr className="font-[400] text-[#101828] dark:text-stone-100 text-sm">
                                            <td className="py-2 pb-6  w-1/4">{capitalizeWords(fetchedRole?.name ?? "")}</td>
                                            <td className={`py-2 pb-6  w-1/4`}>
                                                <p
                                                    className={`w-[86px] before:content-['•'] before:text-2xl flex h-7 items-center justify-center gap-1 px-1 py-0 font-[500] ${fetchedRole?.status === 'ACTIVE' ? "text-green-600 bg-green-100 before:text-green-600 px-1" : "text-red-600 bg-red-100 before:text-red-600 "} rounded-2xl`}
                                                    style={{ textTransform: "capitalize", }}
                                                >
                                                    {capitalizeWords(fetchedRole?.status ?? "")}
                                                </p>
                                            </td>
                                            <td className="py-2 pb-6  w-1/4">{!loading && fetchedRole?.roleType?.name}</td>
                                            <td className="py-2 pb-6  w-1/4"
                                            >
                                                <p className="">
                                                    {formatTimestamp(role?.updated_at)}
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="table-auto w-full text-left py-6 flex gap-[160px]">
                                    <div>
                                        <h3 className="text-sm font-[300]">Permissions</h3>
                                        <ul className="text-sm font-[400] text-[#101828] dark:text-[#F5F5F4] flex flex-col gap-1 pt-4">
                                            {!loading &&
                                                fetchedRole?.permissions?.map((element, i) => {

                                                    return (
                                                        <li key={element?.permission?.name + i}>
                                                            {capitalizeWords(element?.permission?.name ?? "")}
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-[300]">Assigned Users</h3>
                                        <ul className="text-sm font-[400] text-[#101828] dark:text-[#F5F5F4] flex flex-col gap-1 pt-4">
                                            {!loading &&
                                                fetchedRole?.users?.map((user, i) => {

                                                    return (
                                                        <li key={user?.user?.name + i}>
                                                            {capitalizeWords(user?.user?.name ?? "")}
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {/* <table className=" w-full text-left">
                            <thead className="mb-4">
                            <tr className="mb-4 block">
                            <th colSpan={3} className="pt-4">Associated Resources</th>
                            </tr>
                            <tr className="font-light bg-[#25439B] text-[white] text-[14px] ">
                            <td className="p-3"
                            style={{ borderRadius: "10px 0px 0px 10px" }}>Resources Name</td>
                            <td className="p-3" style={{ border: "1px solid grey", borderTop: "none", borderBottom: "none" }}>Role</td>
                            <td className="p-3"
                            style={{ borderRadius: "0px 10px 10px 0px" }}>Permission</td>
                            </tr>
                            </thead>
                            <tbody className="bg-[#fcfcfc] dark:bg-transparent">
                            
                            <tr className="font-light text-[18px]">
                            <td className="px-4 py-2 dark:border dark:border-[#232d3d]">Manager</td>
                            <td className="px-4 py-2 dark:border dark:border-[#232d3d]">Edit, Create, Role</td>
                            <td className="px-4 py-2 dark:border dark:border-[#232d3d]">Edit, Create, Role</td>
                            </tr>
                            <tr className="font-light text-[18px]">
                            <td className="px-4 py-2 pb-6 dark:border dark:border-[#232d3d]">Manager</td>
                            <td className="px-4 py-2 pb-6 dark:border dark:border-[#232d3d]">Delete, </td>
                            <td className="px-4 py-2 pb-6 dark:border dark:border-[#232d3d]">Read</td>
                            </tr>
                            </tbody>
                            </table> */}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default RoleDetailsModal;