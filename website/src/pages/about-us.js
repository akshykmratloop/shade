import Head from "next/head";
import AboutUs from "@/components/about-us.jsx/AboutUs";
import createContent from "@/common/CreateContent";
import { useEffect, useState } from "react";
import Loader from "@/common/Loader";

export default function Aboutus({ apiData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(null);

  console.log(content)
  useEffect(() => {
    if (apiData && Object.keys(apiData).length > 0 && apiData.content) {
      const generatedContent = createContent(apiData.content);
      setContent(generatedContent.content);
      setIsLoading(false);
    } else {
      // keep loading forever or retry (optional)
      console.warn("API response is empty. Keeping loader active...");
    }
  }, [apiData]);


  // if (isLoading) {
  //   return <Loader />; 
  // }

  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="About Us" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AboutUs content={content} />
    </>
  );
}


export async function getServerSideProps() {
  try {
    const res = await fetch(`${backendAPI}about-us`);

    if (!res.ok) {
      // If response failed (e.g., 404, 500), return empty object
      return { props: { apiData: {} } };
    }

    const apiData = await res.json();

    return { props: { apiData: apiData } };
  } catch (error) {
    // If fetch throws an error (e.g., network failure), return empty object
    return { props: { apiData: JSON.stringify(error) } };
  }
}