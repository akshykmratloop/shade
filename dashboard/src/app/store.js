import { configureStore } from '@reduxjs/toolkit'
import headerSlice from '../features/common/headerSlice'
import modalSlice from '../features/common/modalSlice'
import rightDrawerSlice from '../features/common/rightDrawerSlice'
import leadsSlice from '../features/leads/leadSlice'
import userSlice from "../features/common/userSlice"
import debounceSlice from "../features/common/debounceSlice"

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  lead: leadsSlice,
  user: userSlice,
  debounce: debounceSlice
}

export default configureStore({
  reducer: combinedReducer
})