import { RxQuestionMarkCircled } from "react-icons/rx"
import Subtitle from "../Typography/Subtitle"


function TitleCard({ title, children, topMargin, TopSideButtons, question = true }) {
  return (
    <div className={"card w-full min-h-[36.8rem] bg-base-100" + (topMargin || "mt-6")}>

      {/* Title for Card */}
      <h3 className="text-[24px]  py-8 font-[500] h-16 flex items-center gap-1 pl-[25px]">
        {title}
        {
          question &&
          <RxQuestionMarkCircled className="text-[gray] text-lg translate-y-[2px]" />
        }
      </h3>
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