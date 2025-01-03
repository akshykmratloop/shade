import { createContext, useContext, useEffect, useState } from "react";
<<<<<<< HEAD
import data from "./content.json"; // Local fallback data
import axios from "axios";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children, initialContent }) => {
  const [language, setLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(initialContent);
=======
// import axios from "axios";
import data from "./content.json";
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> 7d699876cde70410a01ed299fc29f1995d60b8c5

  useEffect(() => {
    // Check local storage only on the client side
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem("lan");
      setLanguage(storedLanguage || "en");
      setIsLoading(false);
    }
  }, []);

<<<<<<< HEAD
=======
  const [content, setContent] = useState(data);

>>>>>>> 7d699876cde70410a01ed299fc29f1995d60b8c5
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
<<<<<<< HEAD
    // Fetch content from an API if needed, this can be done on the client-side if dynamic content
    const fetchContent = async () => {
      try {
        // const response = await axios.get("http://localhost:3000/content"); // Assuming this endpoint returns content data
        // setContent(response.data);
      } catch (error) {
        console.error("Error fetching content:", error);
        setContent(data); // Fallback to local data in case of error
      }
    };

    if (typeof window !== "undefined" && !initialContent) {
      fetchContent();
    }
  }, [initialContent]);
=======
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
>>>>>>> 7d699876cde70410a01ed299fc29f1995d60b8c5

  if (isLoading) {
    return null;
  }

  return (
    <GlobalContext.Provider value={{ language, toggleLanguage, content }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
