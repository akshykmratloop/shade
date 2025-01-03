import { createRole, getRoles } from './roles.service';

const createRoleHandler = async (req, res) => {
    try {
        const role = await createRole(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRolesHandler = async (req, res) => {
    try {
        const roles = await getRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { createRoleHandler, getRolesHandler };
