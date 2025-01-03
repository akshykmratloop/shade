import {AuthServices} from "./auth.service.js";


const { login, logout, refreshToken, forgotPass, resetPass } = AuthServices


const Login = async (req, res) => {
    const { userId, password} = req.body;
    try {
        const result = await login({ userId, password});
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const Logout = async (req, res) => {
    const { data } = req.body;
    try {
        const result = await logout({ data});
        res.status(201).json(result);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const RefreshToken = async (req, res) => {
    const { data } = req.body;
    try {
        const result = await refreshToken({ data});
        res.status(201).json(result);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const ForgotPass = async (req, res) => {
    const { data } = req.body;
    try {
        const result = await forgotPass({ data});
        res.status(201).json(result);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const ResetPass = async (req, res) => {
    const { data } = req.body;
    try {
        const result = await resetPass({ data});
        res.status(201).json(result);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const AuthController = { Login, Logout, RefreshToken, ForgotPass, ResetPass};




// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { findUserByEmail, createUser } = require('../services/userService');
// const { saveSession } = require('../services/authService');

// const JWT_SECRET = 'your_jwt_secret';

// exports.register = async (req, res) => {
//   const { email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   await createUser(email, hashedPassword);
//   res.status(201).json({ message: 'User registered successfully' });
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await findUserByEmail(email);

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ message: 'Invalid email or password' });
//   }

//   const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
//   req.session.user = { id: user.id, email: user.email };
//   await saveSession(req.session.id, req.session);

//   res.cookie('authToken', token, { httpOnly: true });
//   res.status(200).json({ message: 'Logged in successfully' });
// };

// exports.logout = (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie('authToken');
//     res.status(200).json({ message: 'Logged out successfully' });
//   });
// };

// exports.protectedRoute = (req, res) => {
//   res.status(200).json({ message: `Welcome ${req.session.user.email}` });
// };
