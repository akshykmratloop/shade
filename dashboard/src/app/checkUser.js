export function checkUser(arr) {

    let isEditor = false;
    let isVerifier = false;
    let isPublisher = false;

    if (Array.isArray(arr)) {

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === "EDIT") isEditor = true;
            else if (arr[i] === "VERIFY") isVerifier = true;
            else if (arr[i] === "PUBLISH") isPublisher = true;

            // Early exit if all three found
            if (isEditor && isVerifier && isPublisher) break;
        }

        return { isEditor, isVerifier, isPublisher }
    } else {
        return { isEditor, isVerifier, isPublisher }
    }
}