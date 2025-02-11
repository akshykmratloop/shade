import express from 'express';
import { createUserHandler } from './user.controller';

const router = express.Router();

router.post('/', createUserHandler);

export default {
    init: (app) => app.use('/user', router),
};
