// RoleDetailsModal.js
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
// import { format } from "date-fns";

function RoleDetailsModal({ user, show, onClose }) {


    if (!user) return null;


    return (
        <Dialog open={show} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4 border border-1px solid border border-1 border-red-500">
                <Dialog.Panel className="w-full max-w-2xl shadow-lg shadow-stone rounded- bg-base-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-semibold">User Detail</Dialog.Title>
                        <button onClick={onClose} className="btn btn-ghost btn-xs">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <div>
                            <img src={user.image} alt="" className="w-[7rem] h-[7rem] rounded-lg" />
                        </div>
                        <table className="table-auto w-full text-left">
                            <thead>
                                <tr>
                                    <th colSpan={3} className="pt-4">Personal Details</th>
                                </tr>
                            </thead>
                            <tbody style={{borderBottom: "1px solid #E0E0E0"}}>
                                <tr className="font-light text-sm ">
                                    <td className="px-4 pt-2">Name</td>
                                    <td className="px-4 pt-2">Email</td>
                                    <td className="px-4 pt-2">Phone</td>
                                </tr>
                                <tr className="font-bold text-sm">
                                    <td className="px-4 py-2 pb-6">{user.name}</td>
                                    <td className="px-4 py-2 pb-6">{user.email}</td>
                                    <td className="px-4 py-2 pb-6">{user.phone}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table-auto w-full text-left">
                            <thead>
                                <tr>
                                    <th colSpan={3} className="pt-4">Roles & Permissions</th>
                                </tr>
                            </thead>
                            <tbody style={{borderBottom: "1px solid #E0E0E0"}}>
                                <tr className="font-light text-sm ">
                                    <td className="px-4 pt-2">Name</td>
                                    <td className="px-4 pt-2">Email</td>
                                </tr>
                                <tr className="font-bold text-sm">
                                    <td className="px-4 py-2 pb-6">{user.name}</td>
                                    <td className="px-4 py-2 pb-6">{user.email}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className=" w-full text-left">
                            <thead>
                                <tr>
                                    <th colSpan={3} className="pt-4">Associated Resources</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="font-light bg-[#25439B] text-[white] text-[14px] ">
                                    <td className="p-3"
                                    style={{borderRadius:"10px 0px 0px 10px"}}>Resources Name</td>
                                    <td className="p-3" style={{border:"1px solid grey", borderTop:"none", borderBottom:"none"}}>Role</td>
                                    <td className="p-3"
                                    style={{borderRadius:"0px 10px 10px 0px"}}>Permission</td>
                                </tr>
                                <tr className="font-light text-[18px]">
                                    <td className="px-4 py-2">Manager</td>
                                    <td className="px-4 py-2">Edit, Create, Role</td>
                                    <td className="px-4 py-2">Edit, Create, Role</td>
                                </tr>
                                <tr className="font-light text-[18px]">
                                    <td className="px-4 py-2 pb-6">Manager</td>
                                    <td className="px-4 py-2 pb-6">Delete, </td>
                                    <td className="px-4 py-2 pb-6">Read</td>
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