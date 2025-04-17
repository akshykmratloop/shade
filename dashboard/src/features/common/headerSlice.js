import {createSlice} from "@reduxjs/toolkit";

export const headerSlice = createSlice({
  name: "header",
  initialState: {
    pageTitle: "Home", // current page title state management
    noOfNotifications: 0, // no of unread notifications
    newNotificationMessage: "", // message of notification to be shown
    newNotificationStatus: 1, // to check the notification type -  success/ error/ info
  },
  reducers: {
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload.title;
    },

    removeNotificationMessage: (state, action) => {
      state.newNotificationMessage = "";
    },

    showNotification: (state, action) => {
      state.newNotificationMessage = action.payload.message;
      state.newNotificationStatus = action.payload.status;
    },
    markNotificationAsRead: (state) => {
      if (state.noOfNotifications > 0) {
        state.noOfNotifications -= 1;
      }
    },
    setNotificationCount: (state, action) => {
      state.noOfNotifications = action.payload;
    },
  },
});

export const {
  setPageTitle,
  removeNotificationMessage,
  showNotification,
  markNotificationAsRead,
  setNotificationCount,
} = headerSlice.actions;

export default headerSlice.reducer;
