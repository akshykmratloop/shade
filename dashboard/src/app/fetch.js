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

    console.log(body)
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

async function login(data) {
    return await makerequest(api.route("login"), "POST", JSON.stringify(data), ContentType.json)
}

async function mfaLogin(data) {
    return await makerequest(api.route("mfa_login"), "POST", JSON.stringify(data), ContentType.json);
}

async function mfaVerify(data) {
    return await makerequest(api.route("mfa_verify"), "POST", JSON.stringify(data), ContentType.json);
}

async function forgotPassReq(data) {
    return await makerequest(api.route("forgotPassword"), "POST", JSON.stringify(data), ContentType.json);
}

async function forgotPassReqVerify(data) {
    return await makerequest(api.route("forgotPassword_verify"), "POST", JSON.stringify(data), ContentType.json, true);
}

async function PassUpdate(data) {
    return await makerequest(api.route("forgotPassword_update"), "POST", JSON.stringify(data), ContentType.json, true);
}

async function resetPassword(data) {
    return await makerequest(api.route("resetPassword"), "POST", JSON.stringify(data), ContentType.json, true);
}

async function refreshToken() {
    return await makerequest(api.route("refreshToken"), "POST", JSON.stringify({}), {}, true);
}

async function resendOTP(data) {
    return await makerequest(api.route("resendOTP"), "POST", JSON.stringify(data), ContentType.json, true);
}


export default makerequest;
export { login, mfaLogin, mfaVerify, forgotPassReq, forgotPassReqVerify, PassUpdate, resetPassword, refreshToken, resendOTP }