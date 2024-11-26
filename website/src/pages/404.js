import Link from 'next/link';
import styles from '@/styles/Error.module.scss';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Dynamically import Lottie with ssr: false to prevent SSR issues
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });
import LoaderData from "@/common/404.json";

const Custom404 = () => {
    const route = useRouter();

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
        }, 10000);

        // Cleanup the timeout if the component unmounts before it executes
        return () => clearTimeout(timer);
    }, [route]); // Include 'route' in the dependency array

    return (
        <div className={styles.container}>
            <Lottie options={defaultOptions} height={200} width={500} />
            <p className={styles.description}>
                عذرًا! الصفحة التي تبحث عنها غير موجودة.
            </p>
            <Link href="/" className={styles.homeLink}>العودة إلى الصفحة الرئيسية</Link>
        </div>
    );
};

export default Custom404;
