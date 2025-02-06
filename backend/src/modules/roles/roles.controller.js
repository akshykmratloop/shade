import { createRole, getRoles } from './roles.service.js';


// const createRoleHandler = async (req, res) => {
//     try {
//         const role = await createRole(req.body);
//         res.status(201).json(role);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

const FetchRoles = async (req, res) => {
    const roles = await getRoles();
    // res.set({
    //     'Cache-Control': 'no-store',
    //     'Pragma': 'no-cache',
    //     'Expires': '0'
    // });

    console.log(roles)
    res.status(200).json(roles.roles);
};

export default { FetchRoles };
