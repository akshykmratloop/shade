// {<thead className="border-b border-[#EAECF0]">
//     <tr className="">
//         <th className="font-medium text-[12px] font-poppins leading-normal bg-[#FAFBFB]  text-[#42526D] px-[24px] py-[13px]">
//             Role Name
//         </th>
//         <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB]  px-[24px] py-[13px]">
//             Status
//         </th>
//         <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] px-[24px] py-[13px]">
//             Permission
//         </th>
//         <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] px-[24px] py-[13px]">
//             Sub permission
//         </th>
//         <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] px-[24px] py-[13px]">
//             No. of Users Assigned
//         </th>
//         <th className="text-[#42526D] font-poppins font-medium text-[12px] leading-normal bg-[#FAFBFB] px-[24px] py-[13px]"></th>
//         {/* <th></th> */}
//     </tr>
// </thead>}



// {Array.isArray(roles) &&
//     roles?.map((role, index) => (
//       <tr key={index} className="font-light">
//         <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
//           {role.name}
//         </td>
//         <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
//           <p
//             className={`${
//               role.status === "ACTIVE"
//                 ? "text-green-600"
//                 : "text-red-600"
//             }`}
//           >
//             {role.status}
//           </p>
//         </td>
//         <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
//           <span className="bg-[#F5F6F7] p-1 rounded-full ">
//             {role?._count?.permissions}
//           </span>
//         </td>
//         <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
//           <span className="bg-[#F5F6F7] p-1 rounded-full ">
//             {role?._count?.subPermissions || "3"}
//           </span>
//         </td>
//         <td className="font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
//           <span className="bg-[#F5F6F7] p-1  rounded-full">
//             {role?.usersAssigned || "1"}
//           </span>
//         </td>
//         <td className="flex justify-start space-x-2 font-poppins font-medium text-[14px] leading-normal text-[#101828] p-[26px]">
//           <div className="border-[1px] border-[#E6E7EC] rounded-[7px] flex gap-2 px-[12px] py-[8px]">
//             <button
//               onClick={() => {
//                 setSelectedRole(role);
//                 setShowDetailsModal(true);
//               }}
//             >
//               {/* <MdInfo
//               size={28}
//               className="text-blue-500 dark:text-white"
//             /> */}
//               <span className="flex items-center gap-1 p-[5px]">
//                 <FiEye />
//               </span>
//             </button>
//             <button
//               // className="btn btn-sm"
//               onClick={() => {
//                 setSelectedRole(role);
//                 setShowAddForm(true);
//               }}
//             >
//               {/* <PencilIcon className="w-4" /> */}
//               <FiEdit />
//             </button>
//             <div className="flex items-center space-x-4">
//               <Switch
//                 checked={role.status === "ACTIVE"}
//                 onChange={() => {
//                   statusChange(role);
//                 }}
//                 className={`${
//                   role.status === "ACTIVE"
//                     ? "bg-[#1DC9A0]"
//                     : "bg-[#C7C7CC]"
//                 } relative inline-flex h-2 w-8 items-center rounded-full`}
//               >
//                 <span
//                   className={`${
//                     role.status === "ACTIVE"
//                       ? "translate-x-4"
//                       : "translate-x-0"
//                   } inline-block h-4 w-4 bg-white rounded-full shadow-[0px_2px_8px_0px_#0000003D] border border-gray-300 transition`}
//                 />
//               </Switch>
//               {/* <span>{role.status === 'ACTIVE' ? 'Enabled' : 'Disabled'}</span> */}
//             </div>
//           </div>
//         </td>
//         {/* <td></td> */}
//       </tr>
//     ))}