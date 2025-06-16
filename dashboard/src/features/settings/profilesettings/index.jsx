import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification } from '../../common/headerSlice'
import { FaAngleDown } from "react-icons/fa";
import TitleCard from "../../../components/Cards/TitleCard"
import InputText from '../../../components/Input/InputText'
import formatTimestamp from "../../../app/TimeFormat"
import capitalizeWords from "../../../app/capitalizeword"
import DirectInputFile from "../../../components/Input/DirectInputFile";
import { getUserById } from "../../../app/fetch";
// import moment from "moment"
// import InputFile from "../../../components/Input/InputFile"
// import TextAreaInput from '../../../components/Input/TextAreaInput'
// import ToogleInput from '../../../components/Input/ToogleInput'
// import InputFileNText from "../../../components/Input/InputFileForm"
// import InputFileWithText from "../../../components/Input/InputFileText"
// import InputFileUploader from "../../../components/Input/InputFileUploader"

function ProfileSettings() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user)
    const [isDisable, setIsDisable] = useState(true)
    const [fetchedData, setFetchedData] = useState({})
    const [loading, setLoading] = useState(false)

    console.log(fetchedData)

    const normalUserState = { name: user.name, phone: user.phone, image: user.image }
    const [updateObj, setUpdateObj] = useState(normalUserState)

    const [openIndex, setOpenIndex] = useState(null);

    const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleEditFunctionalty = () => {
        if (!isDisable) setUpdateObj(normalUserState)
        setIsDisable(prev => !prev)
    }

    // Call API to update profile settings changes
    // const updateProfile = () => {
    //     dispatch(showNotification({ message: "Profile Updated", status: 1 }))
    // }

    const updateFormValue = ({ updateType, value }) => {
        setUpdateObj(prev => {

            return ({
                ...prev, [updateType]: value
            })
        })
    }

    useEffect(() => {
        setUpdateObj(normalUserState)
    }, [user])

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
                    setFetchedData(response.user);
                    // setError(false);
                }, 200);
            } catch (err) {
                // setError(true);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 200);
            }
        }
        getUser();
    }, [user]);

    return (
        <div className="relative">
            <TitleCard title="Profile Settings" topMargin="mt-1 flex flex-col">
                <div className="absolute top-1 right-5 w-[145px]">
                    <button className="bg-[#25439B] rounded-lg w-full h-full py-2 text-white border" onClick={handleEditFunctionalty}>
                        {isDisable ? "Edit" : "Cancel"}
                    </button>
                </div>
                <div className="w-fit h-fit relative">
                    <DirectInputFile disabled={isDisable} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText updateType={"name"} labelTitle="Name" defaultValue={updateObj.name} disabled={isDisable} required={false} updateFormValue={updateFormValue} />
                    {/* <InputText labelTitle="ID" defaultValue={user.id} disabled={true} required={false} updateFormValue={updateFormValue} /> */}
                    <InputText labelTitle="Email Id" defaultValue={user.email} disabled={true} required={false} updateFormValue={updateFormValue} />
                    <InputText updateType={"phone"} labelTitle="Phone" defaultValue={updateObj.phone} disabled={isDisable} required={false} updateFormValue={updateFormValue} />
                    {/* <InputText labelTitle="Created At" defaultValue={formatTimestamp(user.createdAt)} required={false} disabled={true} updateFormValue={updateFormValue} /> */}
                    {/* <InputText labelTitle="Last Updated At" defaultValue={formatTimestamp(user.updatedAt)} required={false} disabled={true} updateFormValue={updateFormValue} /> */}
                </div>
                <div className="divider" ></div>

                {!isDisable ?
                    <div className="w-[145px] self-end">
                        <button className="bg-[#25439B] rounded-lg w-full h-full py-2 text-white border" onClick={handleEditFunctionalty}>
                            Update
                        </button>
                    </div>
                    :
                    <div className="w-full mx-auto">
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
                                    {
                                        user?.roles?.length === 0 ?
                                            (<tr>
                                                <td className="px-4 py-2 align-top text-center dark:border dark:border-[#232d3d] w-1/3 " colSpan={2}>
                                                    <div className="h-full">
                                                        No associated roles and permission found.
                                                    </div>
                                                </td>
                                            </tr>) :
                                            user?.roles?.map((role, i) => {
                                                return (
                                                    <tr
                                                        key={role?.id}
                                                        className="font-light text-[14px] text-[#101828] dark:text-[#f5f5f4]"
                                                    >
                                                        <td className="px-4 py-2 align-top dark:border dark:border-[#232d3d] w-1/3">
                                                            <div className="h-full">
                                                                <span className="font-[500] relative  inline-flex items-center before:content-['•'] before:text-stone-800 dark:before:text-stone-200 before:mr-2">
                                                                    {capitalizeWords(role?.role)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 dark:border dark:border-[#232d3d] ">
                                                            {role?.permissions?.map((permission, i, a) => {
                                                                const lastElement = i === a.length - 1;
                                                                return (
                                                                    <span
                                                                        key={permission.id}
                                                                        className="relative pl-2 inline-flex items-center before:content-['•'] dark:before:text-stone-300 before:text-stone-800 before:mr-2"
                                                                    >
                                                                        {capitalizeWords(permission)}
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
                    </div>
                }
            </TitleCard >
        </div>
    )
}

export default ProfileSettings