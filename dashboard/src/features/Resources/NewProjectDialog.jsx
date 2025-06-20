import CloseModalButton from "../../components/Button/CloseButton"

const NewProjectDialog = ({ close, display }) => {

    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center align-center" style={{ display: display ? "block" : "none" }}>
            <div id="modal" className="w-[50vw] h-[80vh] bg-[#fff] relative">
                <CloseModalButton />
                <h2>Create New Resource</h2>
                <div>
                    <h3>Choose Template</h3>
                    <div className="grid grid-cols-2">
                        <div className="rounded-md">
                            <div className="h-[80%]">
                                <img src={``} alt="" />
                            </div>
                            <h3>Portfolio</h3>
                        </div>

                        <div className="rounded-md">
                            <div className="h-[80%]">
                                <img src={``} alt="" />
                            </div>
                            <h3>Portfolio</h3>
                        </div>

                        <div className="rounded-md">
                            <div className="h-[80%]">
                                <img src={``} alt="" />
                            </div>
                            <h3>Portfolio</h3>
                        </div>

                        <div className="rounded-md">
                            <div className="h-[80%]">
                                <img src={``} alt="" />
                            </div>
                            <h3>Portfolio</h3>
                        </div>
                    </div>
                    <div>
                        <button onClick={close}>Cancel</button>
                        <button onClick={close}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewProjectDialog