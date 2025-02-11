import { createUser, findUserByEmail } from './user.service';

const createUserHandler = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = await createUser({ name, email, password, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { createUserHandler };
