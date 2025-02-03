const makerequest = async (uri, method = 'GET',body = undefined, headers = {}) => {
    // Only add body for non-GET requests

    method = method.toUpperCase();
    const options = { // additional options
        method,
        headers
    };

    if (body && method !== 'GET') {
        options.body = body;  // Add body only if it's not a GET request
    }
    console.log(body)

    let result

    try {
        const response = await fetch(uri, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        result = await response.json();
        console.log(result)
    } catch (err) {
        console.log(err)
    } finally {
        return result;
    }
}

export default makerequest;