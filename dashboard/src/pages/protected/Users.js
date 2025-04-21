import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Users from '../../features/charts'
import { setPageTitle } from '../../features/common/headerSlice'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Analytics"}))
      }, [])


    return(
        <Users />
    )
}

export default InternalPage