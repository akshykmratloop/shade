import sessionMiddleware from './sessionConfig.js';
import cookieParser from 'cookie-parser';
import AuthModule from '../modules/auth/index.js';
// import UserModule from '../modules/user';
// import RolesModule from '../modules/roles';
// import PageModule from '../modules/page';

const modules = [AuthModule];

export const useModules = (app) => {
    app.use(cookieParser()); // Use cookie parser
    app.use(sessionMiddleware); // Use session middleware
    modules.forEach((module) => module.init(app));
};
