import { createSlice } from '@reduxjs/toolkit'

const user = createSlice({
    name: "user",
    initialState: {
        user: {
            createdAt: "",
            email: "",
            id: "",
            image: "",
            isSuperUser: false,
            message: "",
            name: "",
            permissions: [],
            roles: [],
            status: "",
            updatedAt: ""
        }
    },
    reducers: {
        // update user reducer, (the user who is logging in)
        updateUser: (state, action) => {
            state.user = action.payload;
        }
    }
})

export const { updateUser } = user.actions;

export default user.reducer;