'use client';

import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const defaultAnimation = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const AnimatedText = ({
  text,
  Wrapper = "p",
  className,
  repeatDelay = 0,
  once = false
}) => {
  const ref = useRef(null);
  // const isInView = useInView(ref, { amount: 0.5, once });
  // const controls = useAnimation();

  // useEffect(() => {
  //   if (isInView) {
  //     controls.start("visible");
  //   } else {
  //     controls.start("hidden");
  //   }
  // }, [isInView, controls]);

  return (
    <div className={className} >{text}</div>
    // <Wrapper className={className} ref={ref}>
    //   <motion.span
    //     variants={{
    //       visible: { transition: { staggerChildren: repeatDelay } },
    //       hidden: {},
    //     }}
    //     initial="hidden"
    //     animate={controls} // Use animation controls
    //     aria-hidden
    //   >
    //     {text.split("").map((char, charIndex) => (
    //       <motion.span
    //         variants={defaultAnimation}
    //         key={`${char}-${charIndex}`}
    //         className="inline-block"
    //       >
    //         {char}
    //       </motion.span>
    //     ))}
    //   </motion.span>
    // </Wrapper>
  );
};

export default AnimatedText;
