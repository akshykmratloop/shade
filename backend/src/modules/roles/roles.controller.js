import { createRole, getRoles } from './roles.service.js';


const CreateRole = async (req, res) => {
    const { name, description } = req.body;

    const result = await createRole({ name, description })

    res.status(201).json(result);
};

const FetchRoles = async (req, res) => {
    const roles = await getRoles();

    res.status(200).json(roles.roles);
};

export default { FetchRoles, CreateRole };
