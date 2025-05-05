export function checkUser(arr) {

    console.log(JSON.stringify(arr))
    let isEditor = false;
    let isVerifier = false;
    let isPublisher = false;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "EDIT") isEditor = true;
        else if (arr[i] === "VERIFY") isVerifier = true;
        else if (arr[i] === "PUBLISH") isPublisher = true;

        // Early exit if all three found
        if (isEditor && isVerifier && isPublisher) break;
    }

    console.log({ isEditor, isVerifier, isPublisher })
    return { isEditor, isVerifier, isPublisher }
}