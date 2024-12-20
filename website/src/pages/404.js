import Link from 'next/link';
import styles from '@/styles/Error.module.scss';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Dynamically import Lottie with ssr: false to prevent SSR issues
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });
import LoaderData from "@/common/404.json";
import { useGlobalContext } from "../contexts/GlobalContext";

const Custom404 = () => {
    const route = useRouter();
    const globalContext = useGlobalContext(); // Store the context in a variable
    const { language, content } = globalContext || {}; // Destructure safely

    // Check if content is available
    const currentContent = content?.notFound;
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: LoaderData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            route.push("/");
        }, 1000000);

        // Cleanup the timeout if the component unmounts before it executes
        return () => clearTimeout(timer);
    }, [route]); // Include 'route' in the dependency array

    return (
        <div className={styles.container}>
            <Lottie options={defaultOptions} height={200} width={500} />
            <p className={styles.description}>
            {currentContent?.description[language]}
            </p>
            <Link href="/" className={`${styles.homeLink} ${language === "en" && styles.enVersion}`}>
            {currentContent?.button?.text[language]}
            </Link>
        </div>
    );
};

export default Custom404;
