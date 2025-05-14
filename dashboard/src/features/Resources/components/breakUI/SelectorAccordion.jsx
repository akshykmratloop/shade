import React, { useEffect, useRef, useState, useMemo } from "react";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";

const SelectorAccordion = ({
  options = [],
  onChange,
  field,
  value = [],
  preAssignedVerifiers,
}) => {
  console.log(options)
  const [selector, setSelector] = useState([{ label: "Level 1", value: "" }]);
  const selectorRef = useRef(null);
  const prevSelectorRef = useRef(selector);

  const lastIndex = useMemo(() => {
    const index = [...selector]
      .reverse()
      .findIndex(obj => typeof obj.value === "string" && obj.value.trim() !== "");
    return index === -1 ? -1 : selector.length - 1 - index;
  }, [selector]);

  const addSelector = (e) => {
    e.preventDefault();
    setSelector(prev => [...prev, { label: `Level ${prev.length + 1}`, value: "" }]);
  };

  console.log(selector)

  const updateSelectorValue = (index, label, newValue) => {
    if (!newValue) return;
    if (options.some(opt => opt.id === newValue && opt.status === "INACTIVE")) return;

    setSelector(prev => {
      if (prev[index][label] === newValue) return prev;
      if (prev.some((e, i) => e.value === newValue && i !== index)) return prev;

      const updated = [...prev];
      updated[index] = { ...updated[index], [label]: newValue };
      return updated;
    });
  };

  const removeSelector = (index) => {
    setSelector(prev =>
      prev.filter((_, i) => i !== index).map((item, i) => ({
        ...item,
        label: `Level ${i + 1}`,
      }))
    );
  };

  const clearSelectorValue = (index) => {
    setSelector(prev =>
      prev.map((e, i) => (i === index ? { ...e, value: "" } : e))
    );
  };

  useEffect(() => {
    if (value.length > 0) {
      setSelector(value.map((e, i) => ({ label: `Level ${i + 1}`, value: e.id })));
    }
  }, [value]);

  useEffect(() => {
    if (selectorRef.current) {
      selectorRef.current.scrollTop = selectorRef.current.scrollHeight;
    }
  }, [selector]);

  useEffect(() => {
    const newValue = selector.map((e, i) => ({ stage: i + 1, id: e.value }));
    const prevValue = prevSelectorRef.current.map((e, i) => ({ stage: i + 1, id: e.value }));

    if (JSON.stringify(newValue) !== JSON.stringify(prevValue)) {
      onChange(field, newValue);
      prevSelectorRef.current = selector;
    }
  }, [selector, field, onChange]);

  return (
    <div
      ref={selectorRef}
      className="w-[101%] max-h-[12.25rem] pb-4 overflow-y-scroll customscroller-2 w-[22rem]"
    >
      {selector.map((select, index) => {
        const isLast = index === selector.length - 1;

        return (
          <div
            key={index}
            className="flex w-[98%] items-center my-1 mt-[2px] gap-2"
          >
            <p className="flex justify-center items-center w-[5rem] h-[2.2rem] bg-[#DFDFDF] dark:bg-[#29469c] text-[#637888] dark:text-[#cecece] text-xs rounded-lg font-[400]">
              {select.label}
            </p>
            <div className="flex-1 relative">
              {/* Custom Select Component (commented out) */}
              {/* <Select
                options={options}
                setterOnChange={updateSelectorValue}
                index={index}
                ...
              /> */}

              <select
                className={`w-full mt-1 px-2 py-2 text-xs border rounded-md outline-none bg-transparent border-stone-300 dark:border-stone-600 ${select.value ? "text-zinc-700 dark:text-zinc-300" : ""
                  }`}
                onChange={(e) =>
                  updateSelectorValue(index, "value", e.target.value)
                }
                value={select.value}
              >
                <option value="">Select</option>
                {options.map((option, i) => (
                  <option
                    key={option.id || i}
                    value={option.id}
                    hidden={option.hidden}
                    className="text-stone-700"
                  >
                    {option.name}
                  </option>
                ))}
              </select>

              <div className="absolute top-1/2 right-[10px] -translate-y-1/2 flex items-center gap-2">
                <IoIosArrowDown className="translate-y-[1px]" strokeWidth={0.1} />
                {selector.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (preAssignedVerifiers && index > lastIndex) {
                        removeSelector(index);
                      } else if (
                        preAssignedVerifiers &&
                        index + 1 <= selector.length
                      ) {
                        clearSelectorValue(index);
                      } else {
                        removeSelector(index);
                      }
                    }}
                    className="p-1 rounded-md text-[#637888] border border-[#cecbcb] dark:border-stone-600"
                  >
                    <RxCross2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {isLast && (
                <button
                  onClick={addSelector}
                  className="absolute top-[84%] right-[-5px] flex items-center justify-center rounded-full bg-blue-700 text-white"
                >
                  <GoPlus className="translate-x-[.5px]" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectorAccordion;
