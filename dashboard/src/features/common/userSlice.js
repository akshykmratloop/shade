import { createSlice } from '@reduxjs/toolkit'
import { checkUser } from '../../app/checkUser';

const initialCurrentRole = {
    role: "",
    roleType: '',
    status: '',
    permissions: []
}

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
        isManager: false,
        isEditor: false,
        isVerifier: false,
        isPublisher: false,
        currentRole: initialCurrentRole
    },
    reducers: {
        // update user reducer, (the user who is logging in)
        updateUser: (state, action) => {
            state.user = action.payload.data;

            state.isManager = action.payload.data.roles[0]?.permissions?.some(e => e.slice(-10) === "MANAGEMENT" && e.slice(0, 4) !== "USER" && e.slice(0, 4) !== "ROLE" && e.slice(0, 4) !== "AUDI")

            // console.log(action.payload.roles[0].permissions)
            // console.log(JSON.stringify(state.isManager))

            const { isEditor, isPublisher, isVerifier } = checkUser(action.payload.data.roles?.[0]?.permissions)

            state.isEditor = isEditor
            state.isPublisher = isPublisher;
            state.isVerifier = isVerifier;

            if (action.payload.type === "update") {
                console.log(state.currentRole.role, action.payload.data.roles?.[0]?.role, state.currentRole.role !== action.payload.data.roles?.[0]?.role)
                console.log(state.currentRole.permissions[0], action.payload.data.roles?.[0]?.permissions[0], JSON.stringify(state.currentRole.permissions) !== JSON.stringify(action.payload.data.roles?.[0]?.permissions))
                if (action.payload.data.roles.length === 0) {
                    console.log("q")
                    state.currentRole = { ...initialCurrentRole }
                } else if (state.currentRole.role !== action.payload.data.roles?.[0]?.role) {
                    console.log("r")
                    state.currentRole = action.payload.data.roles[0]
                } else if (state.currentRole.role === action.payload.data.roles?.[0]?.role && (JSON.stringify(state.currentRole.permissions) !== JSON.stringify(action.payload.data.roles?.[0]?.permissions))) {
                    console.log("test")
                    state.currentRole = action.payload.data.roles[0]
                } else {
                    console.log("s")
                    state.currentRole = { ...initialCurrentRole }
                }
            } else {
                state.currentRole = action.payload.data.roles[0]
            }
        },
        updateCurrentRole: (state, action) => {
            const roleObj = state.user.roles.filter(e => e.role === action.payload)

            state.currentRole = roleObj?.[0] || initialCurrentRole

            const { isEditor, isPublisher, isVerifier } = checkUser(roleObj[0]?.permissions)

            state.isEditor = isEditor;
            state.isPublisher = isPublisher;
            state.isVerifier = isVerifier;

            state.isManager = roleObj?.[0]?.permissions?.some(e => e.slice(-10) === "MANAGEMENT" && e.slice(0, 4) !== "USER" && e.slice(0, 4) !== "ROLE" && e.slice(0, 4) !== "AUDI")
        }
    }
})

export const { updateUser, updateCurrentRole } = user.actions;

export default user.reducer;