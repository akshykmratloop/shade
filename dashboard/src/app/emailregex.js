const emailRegex = {
    regexpression: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    checkRegex: function (string) {
        return this.regexpression.test(string)
    }
}

export default emailRegex