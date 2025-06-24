import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import formatTimestamp from "../../app/TimeFormat";
import { getRoleById } from "../../app/fetch";
import capitalizeWords from "../../app/capitalizeword";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import React from "react";

function ShowLogs({ log, show, onClose }) {
  // console.log(JSON.stringify(log))
  const [fetchedRole, setFetchedRole] = useState({});
  const [fullScreen, setFullScreen] = useState(false);

  const emptyOfObject = { "N/A": "N/A" };
  function getBrowserInfo(uaString) {
    let browserMatch =
      uaString?.match(
        /(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)\/?\s*(\d+)/i
      ) || [];

    // Special handling for older Edge and IE versions
    if (/Trident/i.test(browserMatch[1])) {
      let ieMatch = uaString?.match(/rv:(\d+)/);
      return {
        browser: "Internet Explorer",
        version: ieMatch ? ieMatch[1] : "Unknown",
      };
    }

    if (browserMatch[1] === "Chrome") {
      let edgeOrOpera = uaString?.match(/\b(Edg|OPR)\/(\d+)/);
      if (edgeOrOpera) {
        return {
          browser: edgeOrOpera[1] === "Edg" ? "Edge" : "Opera",
          version: edgeOrOpera[2],
        };
      }
    }

    return {
      browser: browserMatch[1] || "Unknown",
      version: browserMatch[2] || "Unknown",
    };
  }

  const browserInfoToRender = getBrowserInfo(log?.browserInfo) ?? undefined;

  function isValidDateTime(str) {
    return !isNaN(Date.parse(str));
  }

  const modalRef = useRef(null);
  const data = [];

  if (log?.newValue) {
    delete log.newValue.id;
    delete log.newValue.roleTypeId;
    delete log.newValue.image;
    delete log.newValue.password;
    delete log.newValue.isSuperUser;
  }

  if (log?.oldValue) {
    delete log.oldValue.id;
    delete log.oldValue.image;
    delete log.oldValue.password;
    delete log.oldValue.roleTypeId;
    delete log.oldValue.isSuperUser;
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!log) return null;

  // Utility to get the diff keys between two objects (shallow and nested)
  function getChangedPaths(obj1, obj2, prefix = "") {
    let changes = [];
    const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
    for (let key of keys) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof obj1?.[key] === "object" && obj1?.[key] !== null && typeof obj2?.[key] === "object" && obj2?.[key] !== null) {
        changes = changes.concat(getChangedPaths(obj1[key], obj2[key], path));
      } else if ((obj1?.[key] ?? null) !== (obj2?.[key] ?? null)) {
        changes.push(path);
      }
    }
    return changes;
  }

  // Utility to render JSON with highlights for changed fields
  function renderHighlightedJSON(obj, changedPaths, basePath = "", isOld = false, level = 0) {
    if (typeof obj !== "object" || obj === null) {
      return <span>{JSON.stringify(obj)}</span>;
    }
    if (Array.isArray(obj)) {
      return (
        <>
          <div style={{ marginLeft: level * 16 }}>{'['}</div>
          {obj.map((item, idx) => (
            <div key={idx} style={{ marginLeft: (level + 1) * 16 }}>
              {renderHighlightedJSON(item, changedPaths, `${basePath}[${idx}]`, isOld, level + 1)}
              {idx < obj.length - 1 ? <span>,</span> : null}
            </div>
          ))}
          <div style={{ marginLeft: level * 16 }}>{']'}</div>
        </>
      );
    }
    const entries = Object.entries(obj);
    return (
      <>
        <div style={{ marginLeft: level * 16 }}>{'{'}</div>
        {entries.map(([key, value], idx) => {
          const path = basePath ? `${basePath}.${key}` : key;
          const isChanged = changedPaths.includes(path);
          const isObjectOrArray = typeof value === 'object' && value !== null;
          return (
            <div key={key} style={{ marginLeft: (level + 1) * 16, wordBreak: 'break-all' }}>
              <span style={{ color: "#6a9955" }}>&quot;{key}&quot;</span>: {isObjectOrArray
                ? <div>{renderHighlightedJSON(value, changedPaths, path, isOld, level + 1)}</div>
                : isChanged
                  ? <span style={{ background: isOld ? "#ffeaea" : "#fff8c6", color: isOld ? "#d32f2f" : "#7c6f00", borderRadius: 3, padding: "0 2px" }}>{JSON.stringify(value)}</span>
                  : <span>{JSON.stringify(value)}</span>}
              {idx < entries.length - 1 ? <span>,</span> : null}
            </div>
          );
        })}
        <div style={{ marginLeft: level * 16 }}>{'}'}</div>
      </>
    );
  }

  return (
    <Dialog
      open={show}
      onClose={onClose}
      className="relative z-50 font-poppins"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={modalRef}
        className="fixed inset-0 flex items-center justify-center p-4"
      >
        <Dialog.Panel className="w-[653px] h-[600px] overflow-y-scroll customscroller shadow-lg shadow-stone rounded-lg bg-[white] dark:bg-slate-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-[500]">
              Log Details
            </Dialog.Title>
            <button
              onClick={onClose}
              className="bg-transparent hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full border-none p-2 py-2"
            >
              <XMarkIcon className="w-5" />
            </button>
          </div>

          {
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left mb-4">
                <thead></thead>
                <tbody style={{ borderBottom: "1px solid #E0E0E0 " }}>
                  <tr className="font-light text-sm ">
                    <td className="pt-2  w-1/4">Action Type</td>
                    <td className="pt-2  w-1/4">Target</td>
                    <td className="pt-2  w-1/4">Performed By</td>
                    <td className="pt-2  w-1/4">Perfromed Over</td>
                  </tr>
                  <tr className="font-[400] text-[#101828] dark:text-stone-100 text-sm">
                    <td className={`py-2 pb-6 w-1/4`}>
                      {log.actionType ?? "N/A"}
                    </td>
                    <td className="py-2 pb-6  w-1/4">{log.entity ?? "N/A"}</td>
                    <td className="py-2 pb-6 w-1/4">
                      {log?.user?.user?.name ?? "N/A"}
                    </td>
                    <td className="py-2 pb-6  w-1/4">
                      {log?.oldValue?.name ?? log?.newValue?.name ?? "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="table-auto w-full text-left mb-4">
                <thead></thead>
                <tbody style={{ borderBottom: "1px solid #E0E0E0 " }}>
                  <tr className="font-light text-sm ">
                    <td className="pt-2  w-1/4">Outcome</td>
                    <td className="pt-2  w-1/4">Date & Time</td>
                    <td className="pt-2  w-1/4">Browser Info</td>
                    <td className="pt-2  w-1/4">IP Address</td>
                  </tr>
                  <tr className="font-[400] text-[#101828] dark:text-stone-100 text-sm h-30">
                    <td className="py-2 pb-6  w-1/4">
                      <p
                        className={`w-[85px] 
                                                         
                                                        before:content-['•'] 
                                                        before:text-2xl 
                                                        flex h-7 
                                                        items-center
                                                        justify-center gap-1 
                                                        px-1 py-0 font-[500] 
                                                        ${log?.outcome ===
                            "Success"
                            ? "text-green-600 bg-green-100 before:text-green-600 px-1"
                            : log?.outcome ===
                              "Failed"
                              ? "text-red-600 bg-red-100 before:text-red-600"
                              : "text-stone-600 bg-stone-100 before:text-stone-600"
                          } 
                                                        rounded-2xl
                                                        `}
                        style={{ textTransform: "capitalize" }}
                      >
                        {capitalizeWords(log?.outcome ?? "N/A")}
                      </p>
                    </td>
                    <td className={`py-2 pb-6  w-1/4`}>
                      <p className="w-[120px] ">
                        {formatTimestamp(log?.timestamp) || "N/A"}
                      </p>
                    </td>
                    <td className="py-2 pb-6 w-1/4">
                      {`${browserInfoToRender?.browser} ${browserInfoToRender?.version}`}
                    </td>
                    <td className="py-2 pb-6  w-1/4">
                      <p className="">
                        {log?.ipAddress?.slice(7, this?.length) ?? "N/A"}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              {log?.actionType !== "LOGIN" ? (
                null
              ) : (
                ""
              )}

              {/* Render JSON code blocks for oldValue and newValue */}
              {(log?.oldValue || log?.newValue) && (() => {
                const changedPaths = getChangedPaths(log?.oldValue, log?.newValue);
                return (
                  <div className="relative">
                    {/* Full Screen Toggle Button */}
                    <button
                      onClick={() => setFullScreen(true)}
                      title="Full Screen Compare"
                      className="absolute right-0 top-0 z-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded p-1"
                      style={{ display: fullScreen ? 'none' : 'block' }}
                    >
                      <ArrowsPointingOutIcon className="w-5 h-5" />
                    </button>
                    {/* Normal Compare View */}
                    <div className="flex gap-3 mt-4" style={{ filter: fullScreen ? 'blur(2px)' : 'none', pointerEvents: fullScreen ? 'none' : 'auto' }}>
                      {log?.oldValue && (
                        <div className="w-1/2">
                          <div className="font-[500] mb-1">Old Value (JSON)</div>
                          <pre className="bg-gray-100 dark:bg-gray-900 rounded p-2 text-xs" style={{overflowX: 'auto', whiteSpace: 'pre', fontFamily: 'monospace'}}>
                            <code>{renderHighlightedJSON(log.oldValue, changedPaths, "", true)}</code>
                          </pre>
                        </div>
                      )}
                      {log?.newValue && (
                        <div className="w-1/2">
                          <div className="font-[500] mb-1">New Value (JSON)</div>
                          <pre className="bg-gray-100 dark:bg-gray-900 rounded p-2 text-xs" style={{overflowX: 'auto', whiteSpace: 'pre', fontFamily: 'monospace'}}>
                            <code>{renderHighlightedJSON(log.newValue, changedPaths, "", false)}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                    {/* Full Screen Overlay */}
                    {fullScreen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" style={{top:0,left:0}}>
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => setFullScreen(false)}
                            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-2"
                            title="Close Full Screen"
                          >
                            <XMarkIcon className="w-6 h-6" />
                          </button>
                        </div>
                        <div className="flex w-[90vw] h-[90vh] gap-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 overflow-auto">
                          {log?.oldValue && (
                            <div className="w-1/2 h-full flex flex-col">
                              <div className="font-[500] mb-1">Old Value (JSON)</div>
                              <pre className="bg-gray-100 dark:bg-gray-900 rounded p-2 text-xs flex-1 overflow-auto" style={{whiteSpace: 'pre', fontFamily: 'monospace'}}>
                                <code>{renderHighlightedJSON(log.oldValue, changedPaths, "", true)}</code>
                              </pre>
                            </div>
                          )}
                          {log?.newValue && (
                            <div className="w-1/2 h-full flex flex-col">
                              <div className="font-[500] mb-1">New Value (JSON)</div>
                              <pre className="bg-gray-100 dark:bg-gray-900 rounded p-2 text-xs flex-1 overflow-auto" style={{whiteSpace: 'pre', fontFamily: 'monospace'}}>
                                <code>{renderHighlightedJSON(log.newValue, changedPaths, "", false)}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          }
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ShowLogs;
