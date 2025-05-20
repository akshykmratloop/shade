import { RxQuestionMarkCircled } from "react-icons/rx"
import Subtitle from "../Typography/Subtitle"
import { useNavigate } from "react-router-dom"


function TitleCard({ title, children, topMargin, TopSideButtons, question = true, backButton }) {
  const navigate = useNavigate()
  return (
    <div className={"card w-full min-h-[36.8rem] bg-base-100" + (topMargin || "mt-6")}>

      <div className=" flex items-center ">
        {
          backButton &&
          <button className="rounded-md text-white cursor-pointer bg-cyan-700 px-3 py-1 text-sm"
            onClick={() => { navigate("../pages") }}
          >
            <span className="">⟵</span> back
          </button>
        }
        {/* Title for Card */}
        <h3 className="text-[24px] py-8 font-[500] h-16 flex items-center gap-1"
          style={{ paddingLeft: backButton ? "15px" : "25px" }}
        >
          {title}
          {
            question &&
            <RxQuestionMarkCircled className="text-[gray] text-lg translate-y-[2px]" />
          }
        </h3>
      </div>
      <Subtitle styleClass={TopSideButtons ? "inline-block" : ""}>

        {/* Top side button, show only if present */}
        {
          TopSideButtons && <div className="w-full flex">{TopSideButtons}</div>
        }
      </Subtitle>

      {/* <div className="divider mt-2"></div> */}

      {/** Card Body */}
      <div className='h-full w-full  bg-base-100 mt-4 flex flex-col justify-between'>
        {children}
      </div>
    </div>

  )
}


export default TitleCard