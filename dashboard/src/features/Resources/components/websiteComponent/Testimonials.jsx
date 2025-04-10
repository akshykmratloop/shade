// library
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
// modules
import content from './content.json'
import { updateContent } from '../../../common/homeContentSlice';
import { testimonials } from "../../../../assets/index";


const Testimonials = ({ language, testimonyId, screen }) => {
    const isLeftAlign = language === 'en';
    const dispatch = useDispatch();
    const currentContent = useSelector(state => state.homeContent.present.testimonialSection)
    const ImagesFromRedux = useSelector(state => state.homeContent.present.images)

    const testimonial = currentContent?.testimonials?.filter((t, i) => {
        return i === Number(testimonyId)
    })[0]

    useEffect(() => {
        dispatch(updateContent({ currentPath: "testimonialSection", payload: content.testimonialSection }))
    }, [])
    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"} className='p-10 border'>
            <div className={`border bg-white p-3 rounded-xl flex justify-center  shadow-md`}>

                <div className="flex 1">
                    <img
                        src={ImagesFromRedux?.[`testimony/${testimonyId}`] || testimonials?.[testimonial?.image]}
                        height={70}
                        width={70}
                        alt={testimonial?.name}
                        className="rounded-full h-[70px] w-[75px] object-cover border border-gray-200"
                    />
                </div>

                <div className="p-5 w-full">
                    <h3 className="text-gray-900 text-md font-bold">
                        {testimonial?.name?.[language]}
                    </h3>
                    <p className="text-gray-500 text-xs font-light mb-4">
                        {testimonial?.position?.[language]}
                    </p>
                    <p className="text-gray-900 text-xs font-light mb-6 leading-5">
                        {testimonial?.quote?.[language]}
                    </p>
                    <div className={`flex items-center justify- gap-2`}>
                        <img
                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
                            height={18}
                            width={18}
                            alt={testimonial?.name}
                            className="h-[18px] w-[18px]"
                        />
                        <p className={`text-gray-500 text-base font-bold ${isLeftAlign ? "text-left" : "text-right"}`}>
                            {testimonial?.company?.[language]}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Testimonials