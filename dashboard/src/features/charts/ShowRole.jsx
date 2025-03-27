import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getUserById } from "../../app/fetch";
import userIcon from "../../assets/user.png"
import capitalizeWords from "../../app/capitalizeword";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

function UserDetailsModal({ user, show, onClose }) {
    const modalRef = useRef(null)
    const [fetchedUser, setFetchedUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(true);

    const permissions = [];

    fetchedUser?.roles?.forEach((role) => {
        role.role.permissions.forEach((permission) => {
            permissions.push(permission.permission)
        })
    })

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && modalRef.current.contains(e.target)) {
                onClose();
            };
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    useEffect(() => {
        async function getUser() {
            if (!user?.id) return;
            setLoading(true);
            try {
                const response = await getUserById(user.id);
                setTimeout(() => {
                    setFetchedUser(response.user);
                    setError(false);
                }, 200)
            } catch (err) {
                setError(true);
            } finally {
                setTimeout(() => {

                    setLoading(false);
                }, 200)
            }
        }
        getUser();
    }, [user]);

    if (!user) return null;

    return (
        <Dialog open={show} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-[600px] h-[700px] customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6">
                    <div ref={modalRef} className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-[500]">User Details</Dialog.Title>
                        <button onClick={onClose} className="bg-transparent hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full border-none p-2 py-2">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>

                    {
                        loading || error ? (<SkeletonLoader />
                        ) :
                            (

                                <div className="overflow-x-auto">

                                    <div className="flex items-center gap-4">
                                        <img src={user.image || userIcon} alt="" className="w-[4.8rem] h-[4.8rem] rounded-lg" />
                                        <div>
                                            <p className="font-semibold text-[#101828] dark:text-[white]">{user.name}</p>
                                            <p className="text-[gray]">{user.email}</p>
                                        </div>
                                    </div>
                                    <table className="table-auto w-full text-left">
                                        <thead>
                                            <tr>
                                                <th colSpan={3} className="pt-4">Personal Details</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ borderBottom: "1px solid #E0E0E0" }}>
                                            <tr className="font-light text-sm ">
                                                <td className="pt-2 pr-[60px] w-[188px]">Name</td>
                                                <td className="pt-2">Email</td>
                                                <td className="pt-2">Phone</td>
                                            </tr>
                                            <tr className="font-[500] text-[#101828] dark:text-stone-100 text-sm">
                                                <td className="py-2 pb-6">{user.name}</td>
                                                <td className="py-2 pb-6">{user.email}</td>
                                                <td className="py-2 pb-6">{user.phone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="table-auto w-full text-left">
                                        <thead>
                                            <tr>
                                                <th colSpan={3} className="pt-4">Roles & Permissions</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ borderBottom: "1px solid #E0E0E0" }}>
                                            <tr className="font-light text-sm ">
                                                <td className="pt-2 pr-[24px] w-[188px]">Roles</td>
                                                <td className="pt-2">Permissions</td>
                                            </tr>
                                            <tr className="font-[500] text-[#101828] dark:text-stone-100 text-sm pb-7 ">
                                                <td className="py-2 pb-7 w-[118px]"
                                                >
                                                    <div className="flex gap-2 flex-wrap relative">
                                                        <div className={`flex gap-2 flex-wrap top-[-26.5px]`}>
                                                            {fetchedUser?.roles?.map((role, i, a) => {
                                                                let lastElement = i === a.length - 1
                                                                return (<span key={role.role.id} className="">{role.role.name}{!lastElement && ","}</span>)
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="flex items-start py-2">
                                                    <div className={`flex flex-wrap gap-1`}>
                                                        {
                                                            permissions.map((permission, i, a) => {
                                                                let lastElement = i === a.length - 1;
                                                                return (
                                                                    <span key={permission.id} className="mr-1">
                                                                        {capitalizeWords(permission.name)}{!lastElement && `, `}
                                                                    </span>
                                                                );
                                                            })}
                                                    </div>

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className=" w-full text-left">
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
                                            <tr className="font-medium text-[14px] text-[#101828] dark:text-[#f5f5f4]">
                                                <td className="px-4 py-2 dark:border dark:border-[#232d3d]">Manager</td>
                                                <td className="px-4 py-2 dark:border dark:border-[#232d3d]">Edit, Create, Role</td>
                                                <td className="px-4 py-2 dark:border dark:border-[#232d3d]">Edit, Create, Role</td>
                                            </tr>
                                            <tr className="font-medium text-[14px] text-[#101828] dark:text-[#f5f5f4]">
                                                <td className="px-4 py-2 pb-6 dark:border dark:border-[#232d3d]">Manager</td>
                                                <td className="px-4 py-2 pb-6 dark:border dark:border-[#232d3d]">Delete, </td>
                                                <td className="px-4 py-2 pb-6 dark:border dark:border-[#232d3d]">Read</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )
                    }
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default UserDetailsModal;