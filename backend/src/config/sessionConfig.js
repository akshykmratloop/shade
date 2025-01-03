import session from 'express-session';

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.SECURE_SESSION === 'true', // Set to true if using HTTPS
        maxAge: process.env.SESSION_AGE_HOURS * 60 * 60 * 1000 // Convert hours to milliseconds
    },
});

export default sessionMiddleware;