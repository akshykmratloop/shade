import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
// import Resource from '../../features/leads'
import Resource from "../../features/Resources"

function InternalPage() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title: "Sources" }))
    }, [])


    return (
            <Resource />
    )
}

export default InternalPage