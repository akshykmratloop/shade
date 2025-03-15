import Subtitle from "../Typography/Subtitle"

  
  function TitleCard({title, children, topMargin, TopSideButtons}){
      return(
          <div className={"card w-full bg-base-100" + (topMargin || "mt-6")}>

            {/* Title for Card */}
                <h3 className="text-[24px] font-[500] h-16 flex items-center pl-[25px]">{title}</h3>
              <Subtitle styleClass={TopSideButtons ? "inline-block" : ""}>

                {/* Top side button, show only if present */}
                {
                    TopSideButtons && <div className="w-full flex">{TopSideButtons}</div>
                }
              </Subtitle>
              
              {/* <div className="divider mt-2"></div> */}
          
              {/** Card Body */}
              <div className='h-full w-full pb-6 bg-base-100 mt-4'>
                  {children}
              </div>
          </div>
          
      )
  }
  
  
  export default TitleCard