import {RxQuestionMarkCircled} from "react-icons/rx";
import Subtitle from "../Typography/Subtitle";

function TitleCard({title, children, topMargin, TopSideButtons}) {
  return (
    <div className={"card w-full bg-base-100" + (topMargin || "mt-6")}>
      {/* Title for Card */}
      <div className="flex justify-between">
        <h3 className="text-[24px] font-[500] h-16 flex items-center gap-1 pl-[25px]">
          {title}{" "}
          <RxQuestionMarkCircled className="text-[gray] text-lg translate-y-[2px]" />
        </h3>
        <Subtitle
          styleClass={TopSideButtons ? "inline-block p-[0px_25px_0px_0px]" : ""}
        >
          {/* Top side button, show only if present */}
          {TopSideButtons && (
            <div className="w-full flex">{TopSideButtons}</div>
          )}
        </Subtitle>
      </div>

      {/* <div className="divider mt-2"></div> */}

      {/** Card Body */}
      <div className="h-full w-full pb-6 bg-base-100 mt-4">{children}</div>
    </div>
  );
}

export default TitleCard;
