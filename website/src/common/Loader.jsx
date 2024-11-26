import React from 'react'
import LoaderIcon from '@/assets/images/loader.gif'
import styles from "@/common/loader.module.scss"
import Image from 'next/image';
import Lottie from "react-lottie";
import LoaderData from "@/common/loader.json"

const Loader = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: LoaderData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div className={styles.loader_wrapper}>
            <Lottie options={defaultOptions} height={100} width={100} />
            {/* <Image src={LoaderIcon} alt="loader" width="100" height="100" /> */}
        </div>
    )
}

export default Loader
