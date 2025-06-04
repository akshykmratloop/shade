import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import InputText from '../../../components/Input/InputText'
import TextAreaInput from '../../../components/Input/TextAreaInput'
import ToogleInput from '../../../components/Input/ToogleInput'
import InputFileNText from "../../../components/Input/InputFileForm"
import InputFileWithText from "../../../components/Input/InputFileText"
import InputFileUploader from "../../../components/Input/InputFileUploader"
import InputFile from "../../../components/Input/InputFile"
import formatTimestamp from "../../../app/TimeFormat"

function ProfileSettings() {
    const user = useSelector(state => state.user.user)
    const [isDisable, setIsDisable] = useState(true)


    const dispatch = useDispatch()

    // Call API to update profile settings changes
    const updateProfile = () => {
        dispatch(showNotification({ message: "Profile Updated", status: 1 }))
    }

    const updateFormValue = ({ updateType, value }) => {
        console.log(updateType)
    }

    return (
        <>

            <TitleCard title="Profile Settings" topMargin="mt-2">
                <div className="mt-16"><button className="btn btn-primary float-right" onClick={() => updateProfile()}>Edit</button></div>


                <div>
                    <InputFile />
                    {/* <InputFileWithText /> */}
                    {/* <InputFileUploader /> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Name" defaultValue={user.name} disabled={isDisable} updateFormValue={updateFormValue} />
                    <InputText labelTitle="ID" defaultValue={user.id} disabled={true} updateFormValue={updateFormValue} />
                    <InputText labelTitle="Email Id" defaultValue={user.email} disabled={true} updateFormValue={updateFormValue} />
                    <InputText labelTitle="Phone" defaultValue={user.phone} disabled={isDisable} updateFormValue={updateFormValue} />
                    <InputText labelTitle="Created At" defaultValue={formatTimestamp(user.createdAt)} disabled={isDisable} updateFormValue={updateFormValue} />
                    <InputText labelTitle="Last Updated At" defaultValue={formatTimestamp(user.updatedAt)} disabled={isDisable} updateFormValue={updateFormValue} />
                    {/* <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" disabled={isDisable} updateFormValue={updateFormValue} /> */}
                </div>
                <div className="divider" ></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue} />
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue} />
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue} />
                </div>

                {isDisable &&
                    < div className="mt-16"><button className="btn btn-primary float-right" onClick={() => updateProfile()}>Update</button></div>
                }
            </TitleCard >
        </>
    )
}


export default ProfileSettings