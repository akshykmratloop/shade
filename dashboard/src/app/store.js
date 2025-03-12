import { configureStore } from '@reduxjs/toolkit'
import headerSlice from '../features/common/headerSlice'
import modalSlice from '../features/common/modalSlice'
import rightDrawerSlice from '../features/common/rightDrawerSlice'
import leadsSlice from '../features/Resources/leadSlice'
import userSlice from "../features/common/userSlice"
import debounceSlice from "../features/common/debounceSlice"
import sidebarReducer from "../features/common/SbStateSlice";
import imagesReducer from '../features/common/ImagesSlice'
import homeContentReducer from '../features/common/homeContentSlice'

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  lead: leadsSlice,
  user: userSlice,
  debounce: debounceSlice,
  sidebar: sidebarReducer,
  homeContent: homeContentReducer,
  // images: imagesReducer
}

export default configureStore({
  reducer: combinedReducer
})