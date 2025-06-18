import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../features/common/headerSlice";
import {Link} from "react-router-dom";
import TemplatePointers from "../../features/user/components/TemplatePointers";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({title: ""}));
  }, []);

  return (
    <div className=" bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <TemplatePointers />
      </div>
    </div>
  );
}

export default InternalPage;
