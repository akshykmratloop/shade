import { useSelector } from "react-redux";
import { projectPageData } from "../../../../../assets/index";
import { TruncateText } from "../../../../../app/capitalizeword";
import { Img_url } from "../../../../../routes/backend";

const ServiceDetails = ({ serviceId, content, language, screen }) => {
    const slug = useSelector(state => state.homeContent.present.content.slug)
    const isComputer = screen > 1100;
    const isTablet = 1100 > screen && screen > 767;
    const isPhone = screen < 767;
    const isLeftAlign = language === 'en';
    const titleLan = isLeftAlign ? "titleEn" : "titleAr"

    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"} className="w-full">
            {/* banner */}
            <section className={`py-[120px]  ${isPhone ? "px-2" : "px-20"} object-cover text-center flex flex-col items-center bg-cover bg-bottom `}
                style={{ backgroundImage: `linear-gradient(to bottom,#00000020 ,#fffffffb 100%), url(${Img_url + content?.['1']?.content?.images?.[0]?.url})`, }}
            >
                <h1 className={`text-[41px] text-[#292E3D] `}>
                    {content?.['1']?.content?.title?.[language]}
                </h1>
                <p className={`text-[#0E172FB2] text-[10px] w-2/3`}>
                    {content?.['1']?.content?.description?.[language]}
                </p>
            </section>

            {/* Sub services */}
            <section className={`grid ${isTablet || isPhone ? "grid-cols-1 items-center justify-center px-[20px]" : "grid-cols-2 px-[76px]"} gap-y-[27px] gap-x-[25px] py-[34px]`}>
                {
                    (
                        content?.['2']?.items?.concat(content?.[2]?.items).concat(content?.[2]?.items).concat(content?.[2]?.items) ||
                        [])?.map((subService, index) => {
                            return (
                                <article key={index + "wqer"} className={`border-b flex gap-4 pb-[12px]`}>
                                    <article className={`min-w-[197px] py-2`}>
                                        <img src={subService.image || projectPageData.developmentOfHo} alt="" className={`${isTablet || isTablet ? "w-[50vw] aspect-[4/3]" : "w-[196px] h-[135px]"} `} />
                                    </article>
                                    <article className="">
                                        <h3 className="text-[17px]" title={subService?.[titleLan]}>{TruncateText(subService?.[titleLan], 30)}</h3>
                                        <p className="text-[11px]">
                                            {subService?.description?.[language]}
                                        </p>
                                        <button className="text-[#00B9F2] text-[11px]">
                                            {content?.['2']?.content?.button?.[0]?.text?.[language]}
                                            <img src="" alt="" />
                                        </button>
                                    </article>
                                </article>
                            )
                        })
                }
            </section>

            {/* Other Services */}
            <section>
                <h3 className={`text-[#292E3D] font-[400] text-[22px] ${isPhone ? "mx-5" : "mx-[76px]"} py-[20px]`}>Other Services</h3>
                <section className={`${isComputer ? "w-[988px]" : screen} overflow-x-scroll rm-scroll py-5 pt-2`}>
                    <section dir={isLeftAlign ? 'ltr' : 'rtl'}
                        className={`flex gap-7 ${isPhone ? "px-[38px]" : "px-[76px]"} pr-[38px] w-fit items-stretch`}>
                        {
                            (
                                content?.['3']?.items ||
                                []
                            )?.map((service, idx) => {
                                if (service.slug === slug) return null
                                return (
                                    <article
                                        key={idx}
                                        className="flex flex-col bg-white overflow-hidden shadow w-[300px]"
                                    >
                                        <img src={service.image} alt="img" className="w-full object-cover h-[176px]" />
                                        <section className="bg-[#F8F8F8] py-[14px] px-[18px] flex flex-col justify-between flex-1">
                                            <h1 className="text-[#292E3D] text-[22px] font-[400]">
                                                {TruncateText(service?.[titleLan], isTablet ? 15 : 23)}
                                            </h1>
                                            <p className="text-[#292E3D] text-[10px] mb-2">
                                                {service?.description?.[language]}
                                            </p>
                                            <button className={`text-[#00B9F2] flex gap-1 items-center mt-auto ${!isLeftAlign && "flex-rows-reverse"}`}>
                                                {content?.[3]?.content?.button?.[0]?.text?.[language]}
                                                <img
                                                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                                                    alt=""
                                                    className={`${isLeftAlign && "rotate-[180deg]"} w-[16px] h-[16px]`}
                                                />
                                            </button>
                                        </section>
                                    </article>
                                )
                            })}
                    </section>
                </section>
            </section>
        </div>
    )
}

export default ServiceDetails