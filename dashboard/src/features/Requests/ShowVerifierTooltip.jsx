import { useEffect, useRef } from "react";

const ShowVerifierTooltip = ({ children, content, isVisible, onToggle, setOnView }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOnView();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={modalRef} className="relative inline-block" onClick={onToggle}>
      {children}
      {isVisible && (
        <>
          <div className="absolute z-10  w-55 text-[12px] text-gray-800 shadow-lg -translate-x-1/2 left-[-289%] rounded top-[-33%] mt-2 dark:bg-gray-800  dark:text-white ">
            {content}
          </div>
          <div className="w-[10px] h-[10px] absolute z-10 top-[33%] bg-[#25439B] rotate-45 left-[-46%] rounded-sm dark:bg-slate-700"></div>
        </>
      )}
    </div>
  );
};

export default ShowVerifierTooltip;
