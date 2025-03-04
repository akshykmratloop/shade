import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";

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

const SortableItem = ({ option, removeOption }) => {
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
      {option}
      <button
        onClick={() => removeOption(option)}
        className="text-gray-600 hover:text-red-500"
      >
        ✕
      </button>
    </span>
  );
};

const MultiSelect = ({ heading, options, tabName, label, language }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  console.log(options?.[0].title[language])
  const showOptions = options?.map(e =>  e.title[language])


  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const removeOption = (optionToRemove) => {
    setSelectedOptions(selectedOptions.filter((opt) => opt !== optionToRemove));
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
    console.log(selectedOptions)
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
    if (showOptions && selectedOptions.length === 0) {
      setSelectedOptions(showOptions?.map(e => {
        if(e.display){
          return e.title[language]
        }
      }).filter(e => e));
    }
  }, [showOptions]);


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
          {showOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {option}
            </li>
          ))}
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
              <SortableItem key={option} option={option} removeOption={removeOption} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default MultiSelect;
