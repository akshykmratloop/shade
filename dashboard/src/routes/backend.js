const BASE_URL = "http://localhost:3000/";

const api = {
    login: "auth/login",
    signup: "auth/signup", 
    mfa_login: "auth/mfa/login",
    mfa_verify: "auth/mfa/verify",
    forgotPassword:"auth/forgotPassword",
    forgotPassword_verify:"auth/forgotPassword/verify",
    
    route(route) {
        if (this[route]) {
            return BASE_URL + this[route];
        } else {
            throw new Error(`Route ${route} not found`);
        }
    }
};


export default api;
