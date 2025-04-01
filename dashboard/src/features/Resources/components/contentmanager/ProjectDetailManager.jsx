import FileUploader from "../../../../components/Input/InputFileUploader"

const ProjectDetailManager = ({ projectId }) => {

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"ProjectIDReference" + projectId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}

            

        </div>
    )
}

export default ProjectDetailManager