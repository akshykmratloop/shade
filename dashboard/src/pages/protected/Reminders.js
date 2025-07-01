import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Reminders from '../../features/Reminders'

function RemindersPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Reminders"}))
      }, [])

    return(
        <Reminders />
    )
}

export default RemindersPage 