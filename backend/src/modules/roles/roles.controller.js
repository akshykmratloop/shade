import { createRole, getRoles, activateRoles, deactivateRoles, updateRole } from './roles.service.js';


const CreateRole = async (req, res) => {
    const { name, description } = req.body;

    const result = await createRole({ name, description })

    res.status(201).json(result);
};

const FetchRoles = async (req, res) => {
    const roles = await getRoles();

    res.status(200).json(roles.roles);
};

const UpdateRole = async (req, res) => {
    const { id } = req.body;
    delete req.body.id

    const result = await updateRole(id, req.body)

    res.status(202).json(result)
}

const ActivateRole = async (req, res) => {
    const { id } = req.body;
    const result = await activateRoles(id)

    res.status(200).json(result)
}

const DeactivateRole = async (req, res) => {
    const { id } = req.body;
    const result = await deactivateRoles(id)

    res.status(200).json(result)
}

export default { FetchRoles, CreateRole, ActivateRole, DeactivateRole, UpdateRole };
