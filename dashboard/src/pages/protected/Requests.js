import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
// import Resource from '../../features/leads'
import Requests from "../../features/Requests"

function InternalPage() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title: "Sources" }))
    }, [])


    return (
            <Requests />
    )
}

export default InternalPage