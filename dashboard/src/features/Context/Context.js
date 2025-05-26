// ScrollContext.js
import { createContext, useRef } from "react";

export const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
    const scrollContainerRef = useRef();

    return (
        <ScrollContext.Provider value={scrollContainerRef}>
            {children}
        </ScrollContext.Provider>
    );
};
