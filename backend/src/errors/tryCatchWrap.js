const tryCatchWrap = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error); 
    }
};

export default tryCatchWrap; // Export the function for global use
