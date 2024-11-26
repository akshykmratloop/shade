import Head from "next/head";
import AboutUs from "@/components/about-us.jsx/AboutUs";

export default function Solution() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="About Us" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AboutUs />
    </>
  );
}
