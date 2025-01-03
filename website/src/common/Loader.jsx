import React, { useEffect, useState } from 'react';
import LoaderIcon from '@/assets/images/loader.gif';
import styles from "@/common/loader.module.scss";
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import Lottie with ssr: false to ensure it only runs in the browser
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });
import LoaderData from "@/common/loader.json";

const Loader = () => {
  const [isClient, setIsClient] = useState(false);

  // Detect if the component is rendered on the client-side (browser)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define Lottie options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoaderData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Only render Lottie on the client-side
  if (!isClient) {
    return (
      <div className={styles.loader_wrapper}>
        <Image src={LoaderIcon} alt="loader" width={100} height={100} />
      </div>
    );
  }

  return (
    <div className={styles.loader_wrapper}>
      <Lottie options={defaultOptions} height={100} width={100} />
    </div>
  );
};

export default Loader;
