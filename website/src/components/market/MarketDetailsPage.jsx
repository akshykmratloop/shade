import React from "react";
// import styles from "./ProjectDetail.module.scss";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
// import { useTruncate } from "@/common/useTruncate";
import { useRouter } from "next/router";
import { projectPageData } from "../../assets/index";
import NotFound from "../../pages/404";
// Import local font
const BankGothic = localFont({
  src: "../../../public/font/BankGothicLtBTLight.ttf",
  display: "swap",
});
import { useGlobalContext } from "../../contexts/GlobalContext";

const MarketDetailsPage = () => {
  const router = useRouter();
  const { marketId } = router.query;
  const { language, content } = useGlobalContext();
  const currentContent = content?.projectDetail?.filter(
    (item) => item?.id == marketId
  )[0];

//   if (!currentContent) { // of project not found 
//     return <NotFound />;
//   }
//   const { introSection, descriptionSection, gallerySection, moreProjects } =
//     currentContent;

  // const TruncateText = (text, length) => useTruncate(text, length || 200);


//   const TruncateText = (text, length) => {
//     if (text.length > (length || 50)) {
//       return `${text.slice(0, length || 50)}...`;
//     }
//     return text;
//   };

  return (
    <>
      <div style={{height : "700px", width : "100%",
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
      }}>
        <h1>{language === "en" ? "This page is under development and will be updated soon..." : "هذه الصفحة قيد التطوير وسوف يتم تحديثها قريبا..."}</h1>
      </div>
    </>
  );
};

export default MarketDetailsPage;
