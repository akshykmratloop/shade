import { useEffect,useState, useRef } from "react";
import LandingIntro from "../LandingIntro";
import bg1 from "../../../assets/shade-min.jpg";
import bg2 from "../../../assets/shade2-min.jpg";

const BackroundImage = () => {
    const [imgRepeator, setImgRepeator] = useState(0);
    const bgImg = [bg1, bg2];

    const bgRef = useRef(null); // for accessing the background Image


    useEffect(() => {
        // For changing the Background Image
        const bgIntervals = setInterval(() => {
            setImgRepeator(prev => {
                return (prev + 1) % bgImg.length // recurring per images
            })
            bgRef.current.style.display = 'none' // creating an illusion of fade in and out
            bgRef.current.style.display = 'flex'
        }, 10 * 1000) // changes at every 10 seconds

        return () => clearInterval(bgIntervals) // clear side effects
    }, [bgImg.length])

    return (
        <div className='w-full max-w-5xl l-bg lg:flex-5' ref={bgRef} style={{ backgroundImage: `linear-gradient(#333333d1,rgba(0, 0, 0, 0.2)),url(${bgImg[imgRepeator]})` }}> {/* the bg is set in app.css */}
            <LandingIntro /> {/* for Logo and Headings*/}
            <div className='carouselStatus'>
                {
                    bgImg.map((e, i) => {
                        return (<div key={e} className='bg-stone-700 carouselDot' style={{ backgroundColor: i === imgRepeator ? 'black' : '' }}></div>) // look for app.css for the styling
                    })
                }
            </div>
        </div>
    )
}

export default BackroundImage