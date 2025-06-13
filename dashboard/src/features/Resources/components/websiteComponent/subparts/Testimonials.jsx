// library
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
// modules
import content from '../content.json'
import { updateMainContent } from '../../../../common/homeContentSlice';
import { testimonials } from "../../../../../assets/index";
import userIcon from "../../../../../assets/images/userIcon.jpg"
import structureOfTestimony from "../structures/structureOfTestimony.json"
import { Img_url } from '../../../../../routes/backend';
import { differentText } from '../../../../../app/fontSizes';


const Testimonials = ({ language, testimonyId, screen, currentContent, fullScreen, highlight, liveContent }) => {
    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 450;
    const isLeftAlign = language === 'en';
    const content = currentContent?.['1']?.content;
    const live = liveContent?.['1']?.content;


    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"} className='p-10 border'>
            <div className={`border bg-white p-3 rounded-xl flex justify-center  shadow-md`}>

                <div className={`flex 1 h-fit
                        ${checkDifference(content?.images?.[0]?.url, live?.images?.[0]?.url)}
                    `}>
                    <img
                        src={Img_url + content?.images?.[0]?.url}
                        height={70}
                        width={70}
                        alt={content?.images?.[0]?.altText?.[language]}
                        className={`rounded-full h-[70px] w-[75px] object-cover border border-gray-200
                            `}
                    />
                </div>

                <div className="p-5 w-full">
                    <h3 className={`text-gray-900 text-md font-bold
                        ${checkDifference(content?.name?.[language], live?.name?.[language])}
                        `}>
                        {content?.name?.[language] || "Name"}
                    </h3>
                    <p className={`text-gray-500 text-xs font-light mb-4
                        ${checkDifference(content?.position?.[language], live?.position?.[language])}
                        `}>
                        {content?.position?.[language] || "Position"}
                    </p>
                    <p className={`text-gray-900 text-xs font-light mb-6 leading-5
                        ${checkDifference(content?.quote?.[language], live?.quote?.[language])}
                        `}>
                        {content?.quote?.[language] || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur in aliquid delectus cupiditate at, labore ipsum unde, dignissimos ea voluptatibus id atque, quo animi? Laboriosam, quam? Hic necessitatibus vel id?"}
                    </p>
                    <div className={`flex items-center justify- gap-2`}>
                        <img
                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
                            height={18}
                            width={18}
                            alt={content?.name}
                            className="h-[18px] w-[18px]"
                        />
                        <p className={`text-gray-500 text-base font-bold ${isLeftAlign ? "text-left" : "text-right"}
                        ${checkDifference(content?.company?.[language], live?.company?.[language])}
                        `}>
                            {content?.company?.[language] || "Company"}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Testimonials