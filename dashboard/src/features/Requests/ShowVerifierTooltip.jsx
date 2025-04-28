const ShowVerifierTooltip = ({children, content, isVisible, onToggle}) => {
  return (
    <div className="relative inline-block" onClick={onToggle}>
      {children}
      {isVisible && (
        <>
          <div className="absolute z-10  w-55 text-[12px] text-gray-800 shadow-lg -translate-x-1/2 left-[-289%] rounded top-[-33%] mt-2">
            {content}
          </div>
          <div className="w-[10px] h-[10px] absolute z-10 top-[33%] bg-[#25439B] rotate-45 left-[-46%] rounded-sm"></div>
        </>
      )}
    </div>
  );
};

export default ShowVerifierTooltip;
