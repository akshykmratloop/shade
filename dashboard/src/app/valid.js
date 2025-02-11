function validator(obj, setter) {
    // Sort keys to make sure 'email' comes first
    const keys = Object.keys(obj).sort((a, b) => {
        if (a === 'email') return -1; // 'email' should come first
        if (b === 'email') return 1;  // 'email' should come first
        return 0;  // other keys retain their order
    });

    for (let key of keys) {
        // Check if value is empty, null, or undefined
        if (!obj[key] || obj[key].trim() === "") {
            const keyName = key.charAt(0).toUpperCase() + key.slice(1);
            setter(`${keyName} is required`);
            return false; // Exit early if validation fails
        }
    }

    return true; // Return true if all values are valid
}

export default validator;