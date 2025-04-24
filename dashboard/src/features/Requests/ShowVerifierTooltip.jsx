const ShowVerifierTooltip = ({children, content, isVisible, onToggle}) => {
  return (
    <div className="relative inline-block" onClick={onToggle}>
      {children}
      {isVisible && (
        <div className="absolute z-10  w-55 text-[12px] text-gray-800 shadow-lg -translate-x-1/2 left-[-476%] rounded top-[-33%] mt-2">
          {content}
        </div>
      )}
    </div>
  );
};

export default ShowVerifierTooltip;
