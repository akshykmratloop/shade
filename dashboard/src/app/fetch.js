const makerequest = async (uri, method = 'GET', headers = {}, body = undefined) => {
    // Only add body for non-GET requests

    method = method.toUpperCase();
    const options = { // additional options
        method,
        headers
    };

    if (body && method !== 'GET') {
        options.body = body;  // Add body only if it's not a GET request
    }

    const response = await fetch(uri, options);
    const result = await response.json();
    return result;
}

export default makerequest;
