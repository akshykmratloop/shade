// RoleDetailsModal.js
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function RoleDetailsModal({ role, show, onClose }) {
    if (!role) return null;

    return (
        <Dialog open={show} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full h-[50vh]  max-w-2xl shadow-lg shadow-stone p-4 rounded bg-base-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-bold">Role Details</Dialog.Title>
                        <button onClick={onClose} className="btn btn-ghost btn-xs">
                            <XMarkIcon className="w-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left">
                            <tbody>
                                <tr>
                                    <th className="px-4 py-2">ID</th>
                                    <td className="px-4 py-2">{role.id}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <td className="px-4 py-2">{role.name}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Description</th>
                                    <td className="px-4 py-2">{role.description}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Status</th>
                                    <td className="px-4 py-2">{role.status}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Created At</th>
                                    <td className="px-4 py-2">{role.created_at}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Updated At</th>
                                    <td className="px-4 py-2">{role.updated_at}</td>
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