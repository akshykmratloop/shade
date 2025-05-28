import { createSlice } from "@reduxjs/toolkit";
import { checkUser } from "../../app/checkUser";

const initialActiveRole = {
    role: "",
    roleType: "",
    status: "",
    permissions: [],
};
const initialState = {
    user: {
        id: "",
        name: "",
        image: "",
        email: "",
        isSuperUser: true,
        status: "",
        phone: "",
        createdAt: "",
        updatedAt: "",
        roles: [
            {
                role: "",
                roleType: "",
                status: "",
                permissions: [],
            },
        ],
    },
    isManager: false,
    isEditor: false,
    isVerifier: false,
    isPublisher: false,
    activeRole: initialActiveRole,
};
const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        // update user reducer, (the user who is logging in)
        updateUser: (state, action) => {
            
            const roles = action.payload?.data?.roles?.filter((e) => e.status === "ACTIVE")
            state.user = { ...action.payload.data, roles };

            state.isManager = action.payload.data?.roles?.[0]?.permissions?.some(
                (e) =>
                    e.slice(-10) === "MANAGEMENT" &&
                    e.slice(0, 4) !== "USER" &&
                    e.slice(0, 4) !== "ROLE" &&
                    e.slice(0, 4) !== "AUDI"
            );

            const { isEditor, isPublisher, isVerifier } = checkUser(
                roles?.[0]?.permissions
            );

            state.isEditor = isEditor;
            state.isPublisher = isPublisher;
            state.isVerifier = isVerifier;

            // if (action.payload?.type === "update") {
            //     if (!(state?.activeRole?.role && action.payload?.data?.roles?.length > 1)) {
            //         state.activeRole = roles?.[0];
            //     } else if (roles?.length === 0) {
            //         state.activeRole = { ...initialActiveRole };
            //     }
            // } else if (roles?.length === 0) {
            //     state.activeRole = { ...initialActiveRole };
            // } else {
            // }
            // console.log(roles)
            state.activeRole = roles?.[0];
        },
        updateActiveRole: (state, action) => {
            const roleObj = state.user.roles.filter((e) => e.role === action.payload);

            state.activeRole = roleObj?.[0] || initialActiveRole;

            const { isEditor, isPublisher, isVerifier } = checkUser(
                roleObj?.[0]?.permissions
            );

            state.isEditor = isEditor;
            state.isPublisher = isPublisher;
            state.isVerifier = isVerifier;

            state.isManager = roleObj?.[0]?.permissions?.some(
                (e) =>
                    e.slice(-10) === "MANAGEMENT" &&
                    e.slice(0, 4) !== "USER" &&
                    e.slice(0, 4) !== "ROLE" &&
                    e.slice(0, 4) !== "AUDI"
            );
        },
    },
});

export const { updateUser, updateActiveRole } = user.actions;

export default user.reducer;
