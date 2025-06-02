import {createContext, useContext, useEffect, useState} from "react";
// import axios from "axios";
import data from "./content.json";
const GlobalContext = createContext();
import axios from "axios";

export const GlobalContextProvider = ({children}) => {
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
    const fetchContent = async (id) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/website/getContentForWebite/${id}`
        );
        // Adjust the URL as needed
        setContent(response.data);
        console.log("Content fetched successfully:", response.data.content);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent("cmaw7xsgh00tdnt4val4aae3e");
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <GlobalContext.Provider value={{language, toggleLanguage, content}}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
