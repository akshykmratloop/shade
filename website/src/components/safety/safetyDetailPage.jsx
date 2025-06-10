import {useRouter} from "next/router";
import React from "react";

const SafetyDetailPage = ({content}) => {
  const {query} = useRouter();
  const {slug} = query;

  const currentContent = content || {};
  console.log("Safety Detail Page Content:", currentContent);

  return <div>safetyDetailPage</div>;
};

export default SafetyDetailPage;
