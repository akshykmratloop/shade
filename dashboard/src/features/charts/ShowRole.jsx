import { useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import userIcon from "../../assets/user.png"

function RoleDetailsModal({ user, show, onClose }) {
    const modalRef = useRef(null)

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

    if (!user) return null;

    return (
        <Dialog open={show} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-[753px] overflow-y-scroll customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6">
                    <div ref={modalRef} className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-[500]">User Detail</Dialog.Title>
                        <button onClick={onClose} className="bg-transparent hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full border-none p-2 py-2">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex items-center gap-4">
                            <img src={user.image || userIcon} alt="" className="w-[4.8rem] h-[4.8rem] rounded-lg" />
                            <div>
                                <p className="font-semibold text-[black] dark:text-[white]">{user.name}</p>
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
                                    <td className="pt-2 pr-[60px] w-[250px]">Name</td>
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
                                    <td className="pt-2 pr-[24px] w-[250px]">Roles</td>
                                    <td className="pt-2">Permissions</td>
                                </tr>
                                <tr className="font-[500] text-[#101828] dark:text-stone-100 text-sm pb-7">
                                    <td className="py-2 pb-7"
                                    >
                                        <div className="flex gap-2 flex-wrap w-[50px] relative">
                                            <div className="absolute flex gap-2 flex-wrap w-[200px] top-[-14px]">
                                                {user?.roles?.map((e, i, a) => {
                                                    let lastElement = i === a.length - 1
                                                    return (<span key={e.id} className="">{e.name}{!lastElement && ","}</span>)
                                                })}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 pb-10">{user.email}</td>
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
                        </table>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default RoleDetailsModal;