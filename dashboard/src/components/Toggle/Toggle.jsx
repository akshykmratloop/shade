const ToggleSwitch = ({ options, switchToggles }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef(null);
    const [sliderStyle, setSliderStyle] = useState({});
    const buttonRefs = useRef([]);

    useEffect(() => {
        if (buttonRefs.current[selectedIndex]) {
            const button = buttonRefs.current[selectedIndex];
            const { offsetLeft, offsetWidth } = button;
            setSliderStyle({
                left: offsetLeft,
                width: offsetWidth,
            });
        }
    }, [selectedIndex, options]);

    useEffect(() => {
        switchToggles(options[0]);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative inline-flex bg-gray-300 py-0 rounded-md"
        >
            {/* Slider */}
            <div
                className="absolute top-0 bg-blue-500 bottom-1 h-full rounded-md shadow transition-all rounded duration-300 ease-in-out"
                style={sliderStyle}
            ></div>

            {/* Options */}
            {options.map((option, index) => (
                <button
                    key={index}
                    ref={(el) => (buttonRefs.current[index] = el)}
                    onClick={() => {
                        switchToggles(option);
                        setSelectedIndex(index);
                    }}
                    className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200  ${selectedIndex === index
                        ? "text-white"
                        : "text-gray-500 hover:text-black"
                        }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default ToggleSwitch