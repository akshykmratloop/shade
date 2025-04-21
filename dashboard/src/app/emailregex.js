const emailRegex = {
    regexpression: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    checkRegex: function (string) {
        return this.regexpression.test(string)
    }
}

function checkRegex(email, setter) {
    if (email.length === 0) {
        setter("Email is required");
        return true
    }else if (!(emailRegex.checkRegex(email))) {
        setter("Invalid email format!");
        return true
    }
    return false
}

export default emailRegex
export { checkRegex }