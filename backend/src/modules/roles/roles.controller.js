import {createNotification} from "../../repository/notification.repository.js";
import {
  getRoles,
  getRoleById,
  getRoleType,
  createRole,
  activateRoles,
  deactivateRoles,
  updateRole,
} from "./roles.service.js";

const GetRoles = async (req, res) => {
  // const searchTerm = req.query.search || "";
  // const status = req.query.status || "";
  const {search, status, page, limit} = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const response = await getRoles(search, status, pageNum, limitNum);
  res.status(200).json(response);
};

const GetRoleById = async (req, res) => {
  const {id} = req.params;
  const response = await getRoleById(id);
  res.status(200).json(response);
};

const GetRoleType = async (req, res) => {
  const response = await getRoleType();
  res.status(200).json(response);
};

const CreateRole = async (req, res) => {
  const {name, roleTypeId, permissions} = req.body;
  const result = await createRole(name, roleTypeId, permissions);
  await createNotification({
    userId: req.user.id,
    role: "ADMIN",
    message: `A new role ${name} has been created`,
    io: res.app.locals.io,
  });

  res.locals.entityId = result.newRole.roles.id;
  res.status(201).json(result);
  console.log(
    "user ==================================================================",
    req.user
  );
};

// const UpdateRole = async (req, res) => {
//   const {id} = req.body;
//   delete req.body.id;
//   const result = await updateRole(id, req.body);
//   res.status(202).json(result);
// };
const UpdateRole = async (req, res) => {
  const {id} = req.params;
  const {roleName, roleTypeId, permissionsArray} = req.body;
  const result = await updateRole(id, roleName, roleTypeId, permissionsArray);
  res.status(202).json(result);
};

const ActivateRole = async (req, res) => {
  const {id} = req.body;
  const result = await activateRoles(id);
  res.status(200).json(result);
};

const DeactivateRole = async (req, res) => {
  const {id} = req.body;
  const result = await deactivateRoles(id);

  res.status(200).json(result);
};

export default {
  GetRoles,
  GetRoleById,
  GetRoleType,
  CreateRole,
  ActivateRole,
  DeactivateRole,
  UpdateRole,
};
