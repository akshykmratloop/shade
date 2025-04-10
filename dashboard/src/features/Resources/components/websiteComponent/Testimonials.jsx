// library
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
// modules
import content from './content.json'
import { updateContent } from '../../../common/homeContentSlice';
import { testimonials } from "../../../../assets/index";


const Testimonials = ({ language, testimonyId, screen }) => {
    const isEnglish = language === 'en';
    const dispatch = useDispatch();
    const currentContent = useSelector(state => state.homeContent.present.testimonialSection)

    const testimonial = currentContent.testimonials.filter((t, i) => {
        return i === Number(testimonyId)
    })



    useEffect(() => {
        dispatch(updateContent({ currentPath: "testimonialSection", payload: content.testimonialSection }))
    }, [])
    return (
        <div>
            <div className={`bg-white rounded-xl flex justify-center ${language === "en" ? "flex-row-reverse" : ""} shadow-md`}>

                <div className="p-5 w-full">
                    <h3 className="text-gray-900 text-md font-bold">
                        {testimonial.name[language]}
                    </h3>
                    <p className="text-gray-500 text-xs font-light mb-4">
                        {testimonial.position[language]}
                    </p>
                    {
                        <hello></hello>
                        //die har fan
                    }

                    <p className="text-gray-900 text-xs font-light mb-6 leading-5">
                        {testimonial.quote[language]}
                    </p>
                    <div className={`flex items-center justify-end gap-2 ${isEnglish ? "text-left flex-row-reverse" : "text-right"}`}>
                        <p className={`text-gray-500 text-base font-bold ${isEnglish ? "text-left" : "text-right"}`}>
                            {testimonial.company[language]}
                        </p>
                        <img
                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
                            height={18}
                            width={18}
                            alt={testimonial.name}
                            className="h-[18px] w-[18px]"
                        />
                    </div>
                </div>
                <div className="flex 1">
                    <img
                        src={testimonials?.[testimonial?.image]}
                        height={70}
                        width={70}
                        alt={testimonial.name}
                        className="rounded-full h-[70px] w-[70px] object-cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default Testimonials