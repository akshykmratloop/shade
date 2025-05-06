import React, { useEffect, useRef, useState } from "react";
import Select from "../../../../components/Input/Select";
import SelectorAccordion from "./SelectorAccordion";
import { X } from "lucide-react";
import {
  assignUser,
  getAssignedUsers,
  getEligibleUsers,
} from "../../../../app/fetch";
import { toast } from "react-toastify";
import capitalizeWords, { TruncateText } from "../../../../app/capitalizeword";
import { useDispatch, useSelector } from "react-redux";
import { switchDebounce } from "../../../common/debounceSlice";
import SkeletonLoader from "../../../../components/Loader/SkeletonLoader";

const ConfigBar = ({ display, setOn, data, resourceId, reRender }) => {
  const initialObj = {
    resourceId,
    manager: "",
    editor: "",
    verifiers: [{ id: "", stage: NaN }],
    publisher: ""
  }
  const configRef = useRef(null);
  const [userList, setUserList] = useState({ managers: [], editors: [], verifiers: [], publishers: [] })
  const [formObj, setFormObj] = useState(initialObj)
  const [preAssignedUsers, setPreAssignedUsers] = useState({ roles: {}, verifiers: [] })
  const [fetchedData, setFetchedData] = useState(false)
  const [clearPopup, setClearPopup] = useState(false)
  const [loader, setLoader] = useState(false)
  const debouncingState = useSelector(state => state.debounce.debounce)
  const dispatch = useDispatch()

  function updateSelection(field, value) {
    setFormObj((prev) => {
      return { ...prev, [field]: value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (debouncingState) return

    const valueArray = Object.values(formObj);
    const keyArray = Object.keys(formObj);
    let sameDoubledValue = false;
    const verifierSet = new Set(formObj.verifiers.map((e) => e.id));

    for (let i = 0; i < valueArray?.length; i++) {
      if (verifierSet.has(valueArray[i])) sameDoubledValue = true;
      for (let j = i + 1; j < valueArray?.length; j++) {
        if (valueArray[i] === valueArray[j]) sameDoubledValue = true;
      }
      if (keyArray[i] !== "manager" && valueArray[i] === "") {
        return toast.error(`Please select ${capitalizeWords(keyArray[i])}`);
      }
    }

    if (verifierSet.has("")) {
      return toast.error(`${formObj.verifiers.length > 1 ? "Varifiers' fields" : "Varifier's field"} field can not be empty`);
    }

    try {
      dispatch(switchDebounce(true))

      if (!sameDoubledValue) {
        const response = await assignUser(formObj)
        if (response.ok) {
          toast.success("Page assigned Successfully!", {
            autoClose: 700,
            hideProgressBar: true
          })
          setTimeout(() => {

            closeButton()
            reRender(Math.random())
            dispatch(switchDebounce(false))
          }, 700)
        }
      } else {
        return toast.error(`Error! duplicate selection has been found`, { hideProgressBar: true })
      }
    } catch (err) {
      console.log(err?.message)
    } finally {
      setTimeout(() => {
        dispatch(switchDebounce(false))
      }, 700)
    }
  }

  function closeButton() {
    setOn(false);
    setFormObj(initialObj);
  }

  const optionsForManagers = userList.managers.map((e) => ({ id: e.id, name: e.name + (e.status === "INACTIVE" ? " - Inactive" : ""), status: e.status }))
  const optionsForEditor = userList.editors.map((e) => ({ id: e.id, name: e.name + (e.status === "INACTIVE" ? " - Inactive" : ""), status: e.status }))
  const optionsForVerifiers = userList.verifiers.map((e) => ({ id: e.id, name: e.name + (e.status === "INACTIVE" ? " - Inactive" : ""), status: e.status }))
  const optionsForPublisher = userList.publishers.map((e) => ({ id: e.id, name: e.name + (e.status === "INACTIVE" ? " - Inactive" : ""), status: e.status }))

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (configRef.current && !configRef.current.contains(event.target)) {
        closeButton();
      }
    };

    if (display) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [display, setOn]);

  useEffect(() => {
    setFormObj((prev) => ({
      ...prev,
      resourceId: resourceId,
    }));
  }, [resourceId]);

  useEffect(() => {
    setFormObj((prev) => {
      return {
        resourceId,
        manager: preAssignedUsers?.roles?.MANAGER || "",
        editor: preAssignedUsers?.roles?.EDITOR || "",
        verifiers:
          preAssignedUsers?.verifiers?.length > 0
            ? preAssignedUsers?.verifiers
            : [{ id: "", stage: NaN }],
        publisher: preAssignedUsers?.roles?.PUBLISHER || "",
      };
    });
  }, [preAssignedUsers]);

  useEffect(() => {
    async function GetAssingends() {
      const payload = resourceId;
      if (resourceId) {
        try {
          setLoader(true)
          const response = await getAssignedUsers(payload);

          if (response.ok) {

            setPreAssignedUsers((prev) => {
              let roles = {};
              response?.assignedUsers?.roles?.forEach((e) => {
                roles[e?.role] = e?.userId;
              });
              return {
                roles: roles,
                verifiers: response?.assignedUsers?.verifiers?.map((e) => ({
                  stage: e?.stage,
                  id: e?.userId,
                })),
              };
            });
          }
          if (response?.assignedUsers?.roles?.length > 0) {
            setFetchedData(true);
          }
        } catch (err) {

        } finally {
          setLoader(false)
        }
      }
    }

    GetAssingends();
  }, [resourceId]);

  useEffect(() => {
    async function getUser() {
      const response1 = await getEligibleUsers({ permission: "EDIT" });
      const response2 = await getEligibleUsers({ permission: "PUBLISH" });
      const response3 = await getEligibleUsers({ permission: "VERIFY" });
      const response4 = await getEligibleUsers({ permission: "SINGLE_RESOURCE_MANAGEMENT" });
      setUserList({
        managers: [...response4.eligibleUsers],
        editors: [...response1.eligibleUsers],
        publishers: [...response2.eligibleUsers],
        verifiers: [...response3.eligibleUsers]
      })
    }
    getUser()
  }, [])

  return (
    <div
      className={`${display ? "block" : "hidden"
        } fixed z-20 top-0 left-0 w-[100vw] h-screen bg-black bg-opacity-50`}
    >
      <div
        ref={configRef}
        className="fixed z-30 top-0 right-0 w-[26rem] customscroller h-screen overflow-y-auto bg-[white] dark:bg-[#242933]"
      >
        <button
          className="bg-transparent hover:bg-stone-900 hover:text-stone-200 dark:hover:bg-stone-900 rounded-full absolute top-7 border border-gray-500 left-4 p-2 py-2"
          onClick={() => closeButton()}
        >
          <X className="w-[16px] h-[16px]" />
        </button>
        <div className="font-medium pl-[48px] shadow-md-custom p-[30px] px-[40px]">
          <h1
            className="w-[90%] mx-auto text-[1rem] whitespace-pre "
            title={data.titleEn}
          >
            Assign User for {TruncateText(data.titleEn, 21)}
          </h1>
        </div>
        {
          loader ?
            <SkeletonLoader type={"INFO"} />
            :
            <form className="mt-1 flex flex-col justify-between h-[88%] p-[30px] pt-[0px]">
              <div className="flex flex-col gap-4 pt-6 ">
                {/* Selected Page/Content */}
                {/* <div className="w-full dark:border dark:border-[1px] dark:border-stone-700 rounded-md">
              <input 
              type="text"
                className="input w-full px-3 bg-base-300 rounded-md w-[25rem] h-[2.5rem] outline-none disabled:pointer-events-none disabled:cursor-text"
                value={data.titleEn || ""}
                disabled
              />
              </div> */}

                {/* Select Manager */}
                <Select
                  options={optionsForManagers}
                  setterOnChange={updateSelection}
                  field={"manager"}
                  value={formObj.manager}
                  baseClass=""
                  label="Select Manager"
                  labelClass="font-[400] text-[#6B7888] text-[14px]"
                  selectClass="bg-transparent border border-[#cecbcb] dark:border-stone-600 mt-1 rounded-md py-2 h-[2.5rem] outline-none"
                  id={"SelectManager"}
                />

                {/* Select Editor */}
                <Select
                  options={optionsForEditor}
                  setterOnChange={updateSelection}
                  field={"editor"}
                  value={formObj.editor}
                  baseClass=""
                  label="Select Editor"
                  labelClass="font-[400] text-[#6B7888] text-[14px]"
                  selectClass="bg-transparent border border-[#cecbcb] dark:border-stone-600 mt-1 rounded-md py-2 h-[2.5rem] outline-none"
                  id={"SelectEditor"}
                />

                {/* Selector Accordion */}
                <div className="">
                  <label
                    className={
                      "font-[400] text-[#6B7888] dark:border-stone-600 text-[14px]"
                    }
                  >
                    Select Verifier
                  </label>
                  <SelectorAccordion
                    options={optionsForVerifiers}
                    field={"verifiers"}
                    value={formObj.verifiers}
                    onChange={updateSelection}
                    preAssignedVerifiers={preAssignedUsers.verifiers.length > 0}
                    preAssignedLength={preAssignedUsers.verifiers.length}
                  />
                </div>

                {/* Select Publisher */}
                <Select
                  options={optionsForPublisher}
                  setterOnChange={updateSelection}
                  baseClass=""
                  value={formObj.publisher}
                  field={"publisher"}
                  label="Select Publisher"
                  labelClass="font-[400] text-[#6B7888] text-[14px]"
                  selectClass="bg-transparent border border-[#cecbcb] dark:border-stone-600 mt-1 rounded-md py-2 h-[2.5rem] outline-none"
                  id={"SelectPublisher"}
                />

                <div className="flex flex-col gap-4">
                  <div className="flex justify-end">
                    <button className="bg-red-600 text-white p-2 rounded-md text-[12px]" onClick={(e) => { e.preventDefault(); setClearPopup(true) }}>Clear All</button>
                  </div>
                  <div className="bg-stone-500/20 rounded-md text-[14px] text-zinc-700 dark:text-zinc-300 p-3 flex flex-col gap-4 animation-move-left"
                    style={{ display: clearPopup ? "flex" : "none" }}>
                    <p>Do you want to remove all assigned user?</p>
                    <div className="flex gap-2 justify-end">
                      <button className="bg-red-600 text-white p-2 rounded-md text-[12px] w-[30%]" onClick={(e) => { e.preventDefault(); setClearPopup(false) }}>Cancel</button>
                      <button className="bg-[#29469C] text-white p-2 rounded-md text-[12px] w-[30%]" onClick={(e) => { e.preventDefault() }}>Save</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-2 py-4 mt-3">
                <button
                  className="w-[8rem] h-[2.3rem] rounded-md text-xs bg-stone-700 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setOn(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  className="w-[8rem] h-[2.3rem] rounded-md text-xs bg-[#29469c] border-none hover:bg-[#29469c] text-[white]"
                >
                  {fetchedData ? "Update" : "Save"}
                </button>
              </div>
            </form>
        }
      </div>
    </div>
  );
};

export default ConfigBar;
