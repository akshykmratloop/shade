import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
import data from "./content.json";
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    // Check local storage only on the client side
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem("lan");
      setLanguage(storedLanguage || "en"); 
      setIsLoading(false); 
    }
  }, []);

  const [content, setContent] = useState(data);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLanguage = prev === "en" ? "ar" : "en";
      if (typeof window !== "undefined") {
        localStorage.setItem("lan", newLanguage);
      }
      return newLanguage;
    });
  };

  useEffect(() => {
    // Fetch content from API on initial load
    const fetchContent = async () => {
      try {
        // const response = await axios.get("/api/content");
        // setContent(response.data);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
