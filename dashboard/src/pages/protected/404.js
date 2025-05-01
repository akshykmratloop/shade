import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import FaceFrownIcon from '@heroicons/react/24/solid/FaceFrownIcon'
import unavailableIcon from '../../assets/no_data_found.svg'
function InternalPage() {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title: "" }))
    }, [])

    return (
        <div className="hero h-4/5 border h-full">
            {/* <div className="hero-content text-accent text-center">
                <div className="max-w-md">
                <FaceFrownIcon className="h-48 w-48 inline-block"/>
                <h1 className="text-5xl  font-bold">404 - Not Found</h1>
                </div>
            </div> */}
            <div className="">
                <div className="flex justify-center py-16"><img src={unavailableIcon} alt="" className="w-[200px]" /></div>
            </div>
        </div>
    )
}

export default InternalPage