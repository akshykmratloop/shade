import Subtitle from "../Typography/Subtitle";

function TitleCard({title, children, topMargin, TopSideButtons}) {
  return (
    <div className={"card w-full p-6 bg-base-100  " + (topMargin || "mt-6")}>
      {/* Title for Card */}
      <Subtitle
        styleClass={
          TopSideButtons
            ? "inline-block font-[Poppins] font-medium text-[24px] leading-normal text-[#101828] text-black pb-4 px-4"
            : ""
        }
      >
        {title}

        {/* Top side button, show only if present */}
        {TopSideButtons && (
          <div className="inline-block float-right">{TopSideButtons}</div>
        )}
      </Subtitle>

      {/* <div className="divider mt-2"></div> */}

      {/** Card Body */}
      <div className="h-full w-full pb-6 bg-base-100">{children}</div>
    </div>
  );
}

export default TitleCard;
