import React, { useEffect } from 'react'
// import { FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

function SearchBar({ searchText, styleClass, placeholderText, setSearchText, outline}) {



  const updateSearchInput = (value) => {
    setSearchText(value)
  }

  return (
    <div className={"flex-1 flex"}>
      <div className="relative flex-1 flex w-full">
        <input
          type="text"
          value={searchText}
          placeholder={placeholderText || "Search"}
          onChange={(e) => updateSearchInput(e.target.value)}
          className={`input rounded-lg  pl-10 text-sm ${styleClass} custom-placeholder font-[400]`}
          style={{outline: !outline? "none": ""}}
        />
        <CiSearch className='absolute top-[.75rem] left-[.5rem] text-2xl' />
      </div>
    </div>
  )
}

export default SearchBar
