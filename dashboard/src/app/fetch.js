import api from "../routes/backend"

const makerequest = async (uri, method = 'GET', body = undefined, headers = {}, cookie = false) => {
    // const token = localStorage.getItem("authToken"); // Or wherever your token is stored
    // if (token) {
    //     headers['Authorization'] = `Bearer ${token}`;  // Add token to the headers
    // }

    method = method.toUpperCase();
    const options = {
        method,
        headers,
        credentials: cookie ? "include" : "same-origin"
    };

    if (body && method !== 'GET') {
        options.body = body;
    }

    let result;
    try {
        const response = await fetch(uri, options);
        if (!response.ok) {
            const err = await response.json();
            throw err;
        }
        result = await response.json();
    } catch (err) {
        result = err;
    } finally {
        return result;
    }
}


const ContentType = {
    json: { "Content-Type": "application/json" }
}

// fetch for auth
export async function login(data) {
    return await makerequest(api.route("login"), "POST", JSON.stringify(data), ContentType.json);
}

export async function mfaLogin(data) {
    return await makerequest(api.route("mfa_login"), "POST", JSON.stringify(data), ContentType.json);
}

export async function mfaVerify(data) {
    return await makerequest(api.route("mfa_verify"), "POST", JSON.stringify(data), ContentType.json);
}

export async function forgotPassReq(data) {
    return await makerequest(api.route("forgotPassword"), "POST", JSON.stringify(data), ContentType.json);
}

export async function forgotPassReqVerify(data) {
    return await makerequest(api.route("forgotPassword_verify"), "POST", JSON.stringify(data), ContentType.json, true);
}

export async function PassUpdate(data) {
    return await makerequest(api.route("forgotPassword_update"), "POST", JSON.stringify(data), ContentType.json, true);
}

export async function resetPassword(data) {
    return await makerequest(api.route("resetPassword"), "POST", JSON.stringify(data), ContentType.json, true);
}

export async function refreshToken() {
    return await makerequest(api.route("refreshToken"), "POST", JSON.stringify({}), {}, true);
}

export async function resendOTP(data) {
    return await makerequest(api.route("resendOTP"), "POST", JSON.stringify(data), ContentType.json, true);
}

// fetch for roles
export async function fetchRoles() {
    return await makerequest(api.route("fetchRoles"), "GET", JSON.stringify({}), {}, true);
}

export async function createRole(data) {
    return await makerequest(api.route("createRole"), "POST", JSON.stringify(data), ContentType.json, true);
}

export async function activateRole(data) {
    return await makerequest(api.route("activateRole"), "POST", JSON.stringify(data), ContentType.json, true);
}

export async function deactivateRole(data) {
    return await makerequest(api.route("deactivateRole"), "POST", JSON.stringify(data), ContentType.json, true);
}

export default makerequest;