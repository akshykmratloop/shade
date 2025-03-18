const BASE_URL = "http://localhost:3000/";

const auth = "auth";
const role = "role";

const api = {
    login: `${auth}/login`, // API for Auth
    signup: `${auth}/signup`,
    mfa_login: `${auth}/mfa/login`,
    mfa_verify: `${auth}/mfa/verify`,
    forgotPassword: `${auth}/forgotPassword`,
    forgotPassword_verify: `${auth}/forgotPassword/verify`,
    forgotPassword_update: `${auth}/forgotPassword/updatePassword`,
    resetPassword: `${auth}/resetPass`,
    refreshToken: `${auth}/refreshToken`,
    resendOTP: `${auth}/resendOtp`,
    
    fetchRoles: `${role}/roles`, // API for role start from here
    createRole: `${role}/create`,
    activateRole: `${role}/activate`,
    deactivateRole: `${role}/deactivate`,
    updateRole: `${role}/update`,

    route(route) {
        if (this[route]) {
            return BASE_URL + this[route];
        } else {
            throw new Error(`Route ${route} not found`);
        }
    }
};


export default api;
