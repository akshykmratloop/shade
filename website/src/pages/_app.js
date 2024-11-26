import Layout from "@/components/Layout";
import "@/styles/globals.scss";
import { useRouter } from "next/router";
import localFont from "next/font/local";
import { Suspense, useEffect, useState } from "react";
import Loader from "@/common/Loader";

// Font files can be colocated inside of `app`
const BankGothic = localFont({
  src: "../../public/font/BankGothic_Md_BT.ttf",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(false);
  // List of routes that should not include the Layout
  const noLayoutRoutes = ["/404", "/500", "/contact-us"];

  // Check if the current route matches any route in noLayoutRoutes
  const isNoLayoutRoute = noLayoutRoutes.includes(router.pathname);


  useEffect(() => {
    const handleStart = () => setIsPageLoading(true);
    const handleComplete = () => setIsPageLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // console.log(BankGothic.className, "font")
  return (
    <div className={BankGothic.className}>
      {isPageLoading && <Loader />}
      {isNoLayoutRoute ? (
        <Suspense fallback={<Loader />}>
          <Component {...pageProps} />
        </Suspense>
      ) : (
        <Layout>
          <Suspense fallback={<Loader />}>
            <Component {...pageProps} />
          </Suspense>
        </Layout>
      )}
    </div>
  );
}
