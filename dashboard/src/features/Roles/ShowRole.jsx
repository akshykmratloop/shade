import { useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import userIcon from "../../assets/user.png"
import formatTimestamp from "../../app/TimeFormat";


function RoleDetailsModal({ role, show, onClose }) {

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

    if (!role) return null;

    return (
        <Dialog open={show} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-[653px] h-[600px] overflow-y-scroll customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6">
                    <div ref={modalRef} className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-[500]">Role Details</Dialog.Title>
                        <button onClick={onClose} className="bg-transparent hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full border-none p-2 py-2">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">

                        <table className="table-auto w-full text-left">
                            <thead>
                                <tr>
                                    <th colSpan={3} className="pt-4"> Details</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderBottom: "1px solid #E0E0E0" }}>
                                <tr className="font-light text-sm ">
                                    <td className="pt-2 pr-[60px] w-[188px]">Role Name</td>
                                    <td className="pt-2 w-[188px]">Status</td>
                                    <td className="pt-2">Role Type</td>
                                </tr>
                                <tr className="font-[500] text-[#101828] dark:text-stone-100 text-sm">
                                    <td className="py-2 pb-6">{role.name}</td>
                                    <td className="py-2 pb-6">{role.status}</td>
                                    <td className="py-2 pb-6">{role.roleTypeId}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table-auto w-full text-left">
                            <thead>
                                <tr>
                                    <th colSpan={3} className="pt-4">Permissions</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderBottom: "1px solid #E0E0E0" }}>
                                <tr className="font-light text-sm ">
                                    <td className="pt-2 pr-[24px] w-[188px]">Updated At</td>
                                    <td className="pt-2">Permissions</td>
                                </tr>
                                <tr className="font-[500] text-[#101828] dark:text-stone-100 text-sm pb-7">
                                    <td className="py-2 pb-7"
                                    >
                                        <p className="w-[100px]">
                                            {formatTimestamp(role.updated_at)}
                                        </p>
                                    </td>
                                    <td className="py-2 pb-10">{role._count?.permissions}</td>
                                </tr>
                            </tbody>
                        </table>
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
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default RoleDetailsModal;
















// // RoleDetailsModal.js
// import { Dialog } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { format } from "date-fns";

// function RoleDetailsModal({ role, show, onClose }) {
//     if (!role) return null;

//     return (
//         <Dialog open={show} onClose={onClose} className="relative z-50">
//             <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//             <div className="fixed inset-0 flex items-center justify-center p-4">
//                 <Dialog.Panel className="w-full h-[50vh]  max-w-2xl shadow-lg shadow-stone p-4 rounded bg-base-200 p-6">
//                     <div className="flex justify-between items-center mb-4">
//                         <Dialog.Title className="text-lg font-bold">Role Details</Dialog.Title>
//                         <button onClick={onClose} className="btn btn-ghost btn-xs">
//                             <XMarkIcon className="w-5" />
//                         </button>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="table-auto w-full text-left">
//                             <tbody>
//                                 <tr>
//                                     <th className="px-4 py-2">Name</th>
//                                     <td className="px-4 py-2">{role.name}</td>
//                                 </tr>
//                                 <tr>
//                                     <th className="px-4 py-2">Description</th>
//                                     <td className="px-4 py-2">{role.description}</td>
//                                 </tr>
//                                 <tr>
//                                     <th className="px-4 py-2">Status</th>
//                                     <td className="px-4 py-2">{role.status}</td>
//                                 </tr>
//                                 <tr>
//                                     <th className="px-4 py-2">Created At</th>
//                                     <td className="px-4 py-2">{format(new Date(role.created_at), 'dd/MM/yyyy')}</td>
//                                 </tr>
//                                 <tr>
//                                     <th className="px-4 py-2">Updated At</th>
//                                     <td className="px-4 py-2">{format(new Date(role.created_at), 'dd/MM/yyyy')}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </Dialog.Panel>
//             </div>
//         </Dialog>
//     );
// }

// export default RoleDetailsModal;