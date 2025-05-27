// ScrollContext.js
import { createContext, useRef, useState } from "react";

export const Context = createContext();

export const ContenxtProvider = ({ children }) => {
    const scrollContainerRef = useRef();

    const [random, setRandom] = useState(Math.random())

    return (
        <Context.Provider value={{ scrollContainerRef, random: { random, setRandom: () => setRandom(Math.random()) } }}>
            {children}
        </Context.Provider >
    );
};
