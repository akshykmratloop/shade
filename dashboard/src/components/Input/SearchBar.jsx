import React, { useEffect } from 'react'
// import { FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

function SearchBar({ searchText, styleClass, placeholderText, setSearchText }) {



  const updateSearchInput = (value) => {
    // setSearchText(value)
  }

  return (
    <div className={"inline-block "}>
      <div className="relative flex flex-wrap items-stretch w-full ">
        <input
          type="search"
          value={searchText}
          placeholder={placeholderText || "Search"}
          onChange={(e) => updateSearchInput(e.target.value)}
          className={`input rounded-lg w-62 max-w-md pl-10 ${styleClass}`}
        />
        <CiSearch className='absolute top-[.75rem] left-[.5rem] text-2xl' />
      </div>
    </div>
  )
}

export default SearchBar
