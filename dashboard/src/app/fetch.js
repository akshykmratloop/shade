import api from "../routes/backend"

const makerequest = async (uri, method = 'GET', body = undefined, headers = {}, cookie = false) => {
    // Only add body for non-GET requests

    method = method.toUpperCase();
    const options = { // additional options
        method,
        headers,
        credentials: cookie ? "include" : "same-origin"
    };

    if (body && method !== 'GET') {
        options.body = body;  // Add body only if it's not a GET request
    }

    let result

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
    return await makerequest(api.route("resetPassword"), "POST", JSON.stringify(data), ContentType.json);
}

export default makerequest;
export { login, mfaLogin, mfaVerify, forgotPassReq, forgotPassReqVerify, PassUpdate, resetPassword }