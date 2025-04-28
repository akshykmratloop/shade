import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import content from "../websiteComponent/content.json"
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverlay
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateSelectedContent, updateSelectedProject } from "../../../common/homeContentSlice";

const SortableItem = ({ option, removeOption, language, reference, titleLan, contentIndex }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: option, data: { option } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
    opacity: isDragging ? 0.7 : 1,
    boxShadow: isDragging ? "0px 5px 15px rgba(0,0,0,0.2)" : "none",
    scale: isDragging ? "1.05" : "1",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center ${language === 'ar' && "flex-row-reverse text-right"} gap-1 px-3 py-1 text-xs bg-gray-200 min-h-[2.125rem] rounded-md cursor-move dark:text-[black] transition-transform`}
    >

      {reference === "jobs" ?
        option.title.key?.[language] + ", " + option.location.value?.[language]
        : option?.[titleLan]}
      <button
        onClick={() => removeOption(option)}
        className="text-gray-600 hover:text-red-500"
      >
        ✕
      </button>
    </div>
  );
};

const MultiSelect = ({ heading, options, tabName, label, language, section, referenceOriginal = { dir: "", index: 0 }, currentPath, projectId, contentIndex, listOptions }) => {
  const titleLan = language === "en" ? "titleEn" : "titleAr"
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [random, setRandom] = useState(1)
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState(null);

  let operation = "";

  let actualLists; //content.home.serviceSection.cards
  switch (referenceOriginal.dir) {

    case "recentproject":
      actualLists = content.home.recentProjectsSection.sections[referenceOriginal.index].projects
      break;

    case "jobs":
      actualLists = content.careers.jobListSection.jobs;
      break;

    case "news":
      actualLists = content.newsBlogs.latestNewCards.cards;
      break;

    case "projectDetail":
      actualLists = content.projectsPage.projectsSection.projects;
      break;

    case "newsBlogsDetails":
      actualLists = content.newsBlogs.latestNewCards.cards;
      break;

    case "serviceCards":
      actualLists = content.services.serviceCards
      break;

    default:
      actualLists = []
  }


  const showOptions = options?.map(e => e?.[titleLan])

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelect = (optionToAdd) => {
    const existedInList = selectedOptions.some(e => e.id === optionToAdd.id)
    if (existedInList) {
      return
    } else {
      console.log('qwerjwkh')
      setSelectedOptions(prev => {
        return [...prev, { ...optionToAdd }]
      })
    }

    setRandom(prev => prev + 1)
  };


  const removeOption = (optionToRemove) => {
    let deductedArray = selectedOptions.filter(e => e !== optionToRemove)
    setSelectedOptions(deductedArray)
    operation = 'remove'
    setRandom(prev => prev + 1)
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  const onDragStart = ({ active }) => {
    setActiveItem(active.data.current.option);
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setSelectedOptions((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setRandom(prev => prev + 1)
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
  }, []); // Empty array ensures the effect runs only once



  useEffect(() => {
    if (Array.isArray(options) && random !== 1) {

      dispatch(updateSelectedContent({
        origin: referenceOriginal.dir,
        index: referenceOriginal.index,
        section,
        newArray: [...options],
        selected: selectedOptions,
        language,
        currentPath,
        projectId,
        titleLan,
        contentIndex
      }));
    }
  }, [random]); // Minimize dependencies to prevent unnecessary runs


  useEffect(() => {
    if (showOptions) {
      setSelectedOptions(options?.map(e => {
        return e
      }).filter(e => e));
    }
  }, [options]);

  return (
    <div className="relative w-full border-b border-b-2 border-neutral-300 pb-4 mt-4" ref={dropdownRef}>
      <h3 className="font-semibold text-[1.25rem] mb-4">{heading}</h3>
      <label className="sm:text-xs xl:text-sm text-[#6B7888]">{label}</label>
      <button
        onClick={toggleDropdown}
        className="w-full mt-2 p-2 border border-stone-500 rounded-md bg-white hover:bg-gray-100 text-sm bg-[#fafaff] dark:bg-[#2a303c]"
      >
        {isDropdownOpen ? "Close" : tabName}
      </button>

      {isDropdownOpen && (
        <ul className="absolute text-xs left-0 xl:top-[-6.2rem] sm:top-[-3rem] md:top-[-6rem] z-10 w-full mt-2 bg-[#fafaff] dark:bg-[#242933] border rounded-md shadow-md overflow-y-scroll h-[10rem] customscroller">
          {
            listOptions?.map((option, index) => {
              return (
                <li
                  key={option?.[titleLan] + index}
                  onClick={() => handleSelect(option, index)}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {option[titleLan]}
                </li>
              )
            })
          }
        </ul>
      )}

      {/* Drag-and-Drop Enabled List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={selectedOptions} strategy={verticalListSortingStrategy}>
          <div className={`flex flex-wrap  gap-2 p-2 pl-4 border dark:border-stone-500 rounded-md ${language === 'ar' && "flex-row-reverse"}`}>
            {referenceOriginal.dir === "jobs" ?
              selectedOptions?.map((option, i) => (
                <SortableItem key={option.title?.key?.[language] + String(Math.random())} option={option} removeOption={removeOption} language={language} reference={referenceOriginal.dir} />
              ))
              :
              selectedOptions?.map((option, i) => (
                <SortableItem key={option?.[titleLan] + String(Math.random() + i)} option={option} removeOption={removeOption} language={language} titleLan={titleLan} />
              ))
            }
          </div>
        </SortableContext>

        {/* DragOverlay for smooth dragging */}
        {createPortal(
          <DragOverlay>
            {activeItem ? (
              <SortableItem option={activeItem} removeOption={removeOption} language={language} />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default MultiSelect;
