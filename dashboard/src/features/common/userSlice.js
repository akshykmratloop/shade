import { createSlice } from '@reduxjs/toolkit'

const user = createSlice({
    name: "user",
    initialState: {
        user: {
            id: '',
            name: '',
            image: '',
            email: '',
            isSuperUser: true,
            status: '',
            phone: '',
            createdAt: '',
            updatedAt: '',
            roles: [
                {
                    role: '',
                    roleType: '',
                    status: '',
                    permissions: []
                }
            ]
        },
        isManager: false
    },
    reducers: {
        // update user reducer, (the user who is logging in)
        updateUser: (state, action) => {
            state.user = action.payload;

            state.isManager = action.payload.permissions?.some(e => e.slice(-10) === "MANAGEMENT" && e.slice(0, 4) !== "USER" && e.slice(0, 4) !== "ROLE" && e.slice(0, 4) !== "AUDI")
        }
    }
})

export const { updateUser } = user.actions;

export default user.reducer;