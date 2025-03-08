import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import content from "./websiteComponent/content.json"

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateSelectedContent } from "../../common/homeContentSlice";

const SortableItem = ({ option, removeOption, language }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: option });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-200 h-[2.125rem] rounded-md cursor-move dark:text-[black]"
    >
      {option.title?.[language]}
      <button
        onClick={() => removeOption(option)}
        className="text-gray-600 hover:text-red-500"
      >
        ✕
      </button>
    </span>
  );
};

const MultiSelect = ({ heading, options = [], tabName, label, language, section, referencexpression }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [random, setRandom] = useState(Math.random())
  const dispatch = useDispatch();

  const actualListOfServices = content.home.serviceSection.cards  //here 

  const showOptions = options?.map(e => e.title[language])

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelect = (optionToAdd, index) => {
    for (let i = 0; i < options.length; i++) {
      if (optionToAdd.title === options[i].title) {
        if (options[i].display) return
        setSelectedOptions(prev => {
          return [...prev, { ...optionToAdd, display: true }]
        })
        break;
      }
    }
    setRandom(Math.random())
  };

  const removeOption = (optionToRemove) => {
    setSelectedOptions(prev => {
      return prev.map(option => {
        console.log(option === optionToRemove)
        if (option === optionToRemove) {
          return { ...option, display: false }
        }
        return option
      })
    })
    setRandom(Math.random())
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setSelectedOptions((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setRandom(Math.random())
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showOptions) {
      setSelectedOptions(options?.map(e => {
        if (e.display) {
          return e
        }
      }).filter(e => e));
    }
  }, [options]);

  useEffect(() => {
    if (options.length > 0) {
      dispatch(updateSelectedContent({ section, newArray: [...options], selected: selectedOptions, language }));
    }
  }, [random]);

  return (
    <div className="relative w-full border-b border-b-2 border-neutral-300 pb-4" ref={dropdownRef}>
      <h3 className="font-semibold text-[1.25rem] mb-4">{heading}</h3>
      <label className="sm:text-xs xl:text-sm">{label}</label>
      <button
        onClick={toggleDropdown}
        className="w-full mt-2 p-2 border border-stone-500 rounded-md bg-white hover:bg-gray-100 text-sm bg-[#fafaff] dark:bg-[#2a303c]"
      >
        {isDropdownOpen ? "Close" : tabName}
      </button>

      {isDropdownOpen && (
        <ul className="absolute text-xs left-0 xl:top-[-6.2rem] sm:top-[-3rem] md:top-[-6rem] z-10 w-full mt-2 bg-[#fafaff] dark:bg-[#242933] border rounded-md shadow-md overflow-y-scroll h-[10rem] customscroller">
          {actualListOfServices.map((option, index) => {
            return (
              <li
                key={option.title[language]}
                onClick={() => handleSelect(option, index)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {option.title[language]}
              </li>
            )
          })}
        </ul>
      )}

      {/* Drag-and-Drop Enabled List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={selectedOptions} strategy={verticalListSortingStrategy}>
          <div className="flex flex-wrap gap-2 p-2 pl-4 border dark:border-stone-500 rounded-md ">
            {selectedOptions.map((option) => (
              <SortableItem key={option.title?.[language]} option={option} removeOption={removeOption} language={language} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default MultiSelect;
