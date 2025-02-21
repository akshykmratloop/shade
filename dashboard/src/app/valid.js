function validator(obj, setter) {
    // Sort keys to make sure 'email' comes first
    const keys = Object.keys(obj).sort((a, b) => {
        if (a === 'email') return -1; // 'email' should come first
        if (b === 'email') return 1;  // 'email' should come first
        return 0;  // other keys retain their order
    });

    let flag = true;

    for (let key of keys) {
        // Check if value is empty, null, or undefined
        if (!obj[key] || obj[key].trim() === "") {
            const keyName = key.charAt(0).toUpperCase() + key.slice(1);
            if (typeof (setter) === 'object') {
                setter[(keyName.toLowerCase())](`${keyName.replace("_", " ")} is required`)
            } else {
                setter(`${keyName} is required`)
            }
            flag = false; // Exit early if validation fails
        }
    }
    return flag; // Return true if all values are valid
}

export default validator;