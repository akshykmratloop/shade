import { useEffect, useRef, useState } from "react";
import StatusBar from "./Statusbar";
import Assigned from "../../../../assets/image 13.png";
import Edit from "../../../../assets/image 14.svg";
import Verify from "../../../../assets/image 15.svg";
import Publisher from "../../../../assets/image 16.svg";
import { X } from "lucide-react";
import { getResourceInfo } from "../../../../app/fetch";
import formatTimestamp from "../../../../app/TimeFormat";
import { useDispatch, useSelector } from "react-redux";
import capitalizeWords, { TruncateText } from "../../../../app/capitalizeword";
import SkeletonLoader from "../../../../components/Loader/SkeletonLoader";
import { useNavigate } from "react-router-dom";
import { updateResourceId } from "../../../common/resourceSlice";

const PageDetails = ({ data, display, setOn }) => {
  // console.log(data)
  const pageRef = useRef(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user.user);
  const activeRole = useSelector((state) => state.user.activeRole)
  const navigate = useNavigate()
  const dispatch = useDispatch();


  const users = {}
  pageInfo?.resourceInfo?.roles?.forEach((e, i) => {
    users[e.role?.toLowerCase()] = e.user.name
  })
  // const manager = pageInfo?.resourceInfo?.roles[0]?.user?.name
  // const manager = pageInfo?.resourceInfo?.roles[0]?.user?.name
  // const manager = pageInfo?.resourceInfo?.roles[0]?.user?.name


  useEffect(() => {
    if (display && data?.id) {
      setLoading(true);
      getResourceInfo(data?.id)
        .then((res) => {
          setPageInfo(res);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to fetch resource info", err);
          setError("Unable to load page details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [display, data?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pageRef.current && !pageRef.current.contains(event.target)) {
        setOn(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOn(false);
      }
    }

    if (display) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [display, setOn]);

  //status bar stages
  const computeStage = () => {
    const roles = pageInfo?.resourceInfo?.roles || [];
    const hasRoles = roles.length > 0;
    const newVersion = pageInfo?.resourceInfo?.newVersionEditMode;
    const versionMode = newVersion?.versionMode;

    if (!hasRoles) return 0;
    if (versionMode === "editMode") return 2;
    if (versionMode === "verificationMode") return 3;
    if (versionMode === "publishMode") return 4;
    return 1;
  };

  return (
    <div
      className={`${display ? "block" : "hidden"
        } fixed z-20 top-0 left-0 w-[100vw] h-screen bg-black bg-opacity-50 `}
    >
      <div
        ref={pageRef}
        className="fixed z-20 top-0 right-0 w-[26rem] h-screen bg-[white] dark:bg-[#242933] shadow-xl-custom"
      >
        <button
          className="bg-transparent hover:bg-stone-900 hover:text-stone-200 dark:hover:bg-stone-900 rounded-full absolute top-7 border border-gray-500 dark:border-stone-700 left-4 p-2 py-2"
          onClick={() => setOn(false)}
        >
          <X className="w-[16px] h-[16px]" />
        </button>
        <h1
          className="font-medium text-[1.1rem] shadow-md-custom p-[30px] text-center"
          title={data?.titleEn}
        >
          Page Details for {TruncateText(data?.titleEn, 12)}
        </h1>
        {
          loading ?
            <SkeletonLoader type={"INFO"} />
            :
            <div className="dark:border-none flex flex-col h-[87%] text-[14px] custom-text-color p-[30px] py-0  mt-2 border overflow-y-scroll customscroller">
              <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                <label>Total Versions:</label>
                <p>{pageInfo?.resourceInfo?._count?.versions}</p>
              </div>
              {/* <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
            <label>Request Number:</label>
            <p>2</p>
          </div> */}
              {/* <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                <label>Last Edited:</label>
                <p>{formatTimestamp(pageInfo?.resourceInfo?.updatedAt)}</p>
              </div> */}
              <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                <label>Live Version:</label>
                <div className={`flex flex-col items-end gap-[2.5px]`}>
                  <p className="text-right py-0 my-0 !w-full">
                    <span>
                      {`V${pageInfo?.resourceInfo?.liveVersion?.versionNumber}`}
                    </span>
                  </p>
                  {(user?.isSuperUser ||
                    activeRole?.permissions?.includes("PAGE_MANAGEMENT")) && (
                      <>
                        {/* <button
                          className="text-[#145098] dark:text-sky-500 underline font-[300] py-0 my-0"
                          style={{ whiteSpace: "pre" }}
                        >
                          Restore Previous Version
                        </button> */}
                        <button className="text-[#145098] dark:text-sky-500 underline font-[300] py-0 my-0"
                          onClick={() => {
                            dispatch(updateResourceId({ id: data.id, name: data.titleEn }))
                            localStorage.setItem("currentResource", JSON.stringify({ resourceId: data.id, resourceName: data.titleEn }))
                            navigate('../versions')
                          }}
                        >
                          View Version
                        </button>
                      </>
                    )}
                </div>
              </div>
              <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                <label>Ongoing Requests:</label>
                <div className={`flex flex-col items-end gap-[2.5px]`}>
                  {(
                    <>
                      <button className="text-[#145098] dark:text-sky-500 underline font-[300] py-0 my-0"
                        onClick={() => {
                          dispatch(updateResourceId({ id: data.id, name: data.titleEn }))
                          localStorage.setItem("currentResource", JSON.stringify({ resourceId: data.id, resourceName: data.titleEn }))
                          navigate('../requests')
                        }}
                      >
                        View Requests
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex py-[15px] justify-between border-b-4 border-gray-400 dark:border-stone-700">
                <label>Page Status:</label>
                <p className={`${pageInfo?.resourceInfo?.status === "ACTIVE" ? "bg-lime-500" : "bg-red-500"} text-white rounded-full px-2`}>{capitalizeWords(pageInfo?.resourceInfo?.status)}</p>
              </div>
              <div className="flex flex-col py-[15px] pb-[2px] justify-between">
                <label>Assigned Users:</label>
                <div className="">
                  <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
                    <label className="!text-[#808080]" title={users?.manager}>Manager:</label>
                    <p>{TruncateText(users?.manager, 17) || "N/A"}</p>
                  </div>
                  <div className="border-b dark:border-stone-700 flex justify-between py-2 h-[43px] items-center">
                    <label className="!text-[#808080]" title={users?.editor}>Editor:</label>
                    <p>{TruncateText(users?.editor, 17) || "N/A"}</p>
                  </div>
                  {/* <div className="border border-cyan-500 flex"> */}
                  <div className="flex flex-col">
                    {pageInfo?.resourceInfo?.verifiers?.length > 0 ? pageInfo?.resourceInfo?.verifiers.map((verifier, ind) => {
                      let firstIndex = ind === 0;
                      return (
                        <div
                          key={verifier?.id}
                          className={`flex gap-[10px] items-center border-b dark:border-stone-700 ${firstIndex ? "justify-between" : "justify-end"
                            }`}
                        >
                          {firstIndex && (
                            <label className="!text-[#808080]">Verifiers:</label>
                          )}
                          <div className="flex gap-[10px] items-center justify-between py-[10px] w-[65%]">
                            <p className="border px-[12px] w-[6rem] py-[2px] text-center rounded-3xl font-light text-[11px]">
                              {"level " + parseInt(ind + 1)}
                            </p>
                            <p title={verifier?.user?.name}>
                              {TruncateText(verifier?.user?.name, 12)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                      :
                      <div
                        className={`flex gap-[10px] items-center border-b dark:border-stone-700 justify-between`}
                      >
                        <label className="!text-[#808080]">Verifiers:</label>
                        <div className="flex gap-[10px] items-center justify-between py-[10px] ">
                          {/* <p className="border px-[12px] w-[6rem] py-[2px] text-center rounded-3xl font-light text-[11px]">
                            {"level " + "N/A"}
                          </p> */}
                          <p >
                            N/A
                          </p>
                        </div>
                      </div>
                    }
                  </div>
                  <div className="border-b-4 border-gray-400 dark:border-stone-700 flex justify-between py-4 items-center">
                    <label className="!text-[#808080]" title={users?.publisher}>Publisher:</label>
                    <p>{TruncateText(users?.publisher, 17) || "N/A"}</p>
                  </div>
                  {/* </div> */}
                </div>
              </div>
              <div className="flex flex-col py-4">
                {pageInfo?.resourceInfo?.['newVersionEditMode']?.versionNumber &&
                  <div>
                    <label>New Version In Edit Mode:</label>
                    <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                      <label>Version Number:</label>
                      <div className={`w-max flex flex-col items-end gap-[2.5px]`}>
                        <p className="text py-0 my-0">V{pageInfo?.resourceInfo?.['newVersionEditMode']?.versionNumber}</p>
                        {/* <button
                  className="text-[#145098] dark:text-sky-500 underline font-[300] py-0 my-0"
                  style={{whiteSpace: "pre"}}
                  >
                  Restore Previous Version
                  </button> */}
                        {(user?.roles?.includes("SUPER_ADMIN") ||
                          user?.permissions?.includes("PAGE_MANAGEMENT")) && (
                            <button className="text-[#145098] dark:text-sky-500 underline font-[300] py-0 my-0">
                              View
                            </button>
                          )}
                      </div>
                    </div>
                  </div>}
                {/* <div className="flex py-[15px] justify-between border-b dark:border-stone-700">
                    <p>Null</p>
                  </div> */}
                <div className="flex flex-col gap-[15px] text-[11px] py-4">
                  <label className="text-[15px]">Version Status:</label>
                  <div className="">
                    <StatusBar stage={computeStage()} />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col translate-x-[14px]">
                      <img
                        src={Assigned}
                        alt=""
                        className="w-[20px] h-[20px] dark:invert"
                      />
                      <p>Assigned</p>
                    </div>
                    <div className="flex flex-col items-center translate-x-[12px]">
                      <img
                        src={Edit}
                        alt=""
                        className="w-[20px] h-[20px] dark:invert"
                      />
                      <p>Edit</p>
                    </div>
                    <div className="flex flex-col items-center translate-x-[12px]">
                      <img
                        src={Verify}
                        alt=""
                        className="w-[20px] h-[20px] dark:invert"
                      />
                      <p>Verify ({"Level 2"}) </p>
                    </div>
                    <div className="flex flex-col items-center translate-x-[0px]">
                      <img
                        src={Publisher}
                        alt=""
                        className="w-[20px] h-[20px] dark:invert"
                      />
                      <p>Publish</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    </div>
  );
};

export default PageDetails;
