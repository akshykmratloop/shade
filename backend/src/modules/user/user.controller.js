import {getSocketId} from "../../helper/socketConnectionID.js";
import {
  activateUsers,
  createUser,
  deactivateUsers,
  editUserDetails,
  findUserByEmail,
  getAllRolesForUser,
  getAllUsers,
  getAllUsersByRoleId,
  getUserById,
  userRoleType,
} from "./user.service.js";

const CreateUserHandler = async (req, res) => {
  const {name, email, password, phone, roles} = req.body;
  const user = await createUser(name, email, password, phone, roles);
  res.locals.entityId = user.user.id;
  res.status(201).json(user);
  // console.log(user.user.id, "entityId_reslocals");
};

const GetAllUsers = async (req, res) => {
  const {name, email, phone, status, page, limit} = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 40;
  const allUser = await getAllUsers(
    name,
    email,
    phone,
    status,
    pageNum,
    limitNum
  );
  res.status(201).json(allUser);
};

const GetUserById = async (req, res) => {
  const {id} = req.params;
  const response = await getUserById(id);
  res.status(200).json(response);
};

const GetAllUsersByRoleId = async (req, res) => {
  const {roleId} = req.params;
  console.log(roleId, "roleId");

  const allUser = await getAllUsersByRoleId(roleId);

  res.status(201).json(allUser);
};

const EditUserDetails = async (req, res) => {
  const {id} = req.params;
  const {name, password, phone, roles} = req.body;

  const updatedUser = await editUserDetails(id, name, password, phone, roles);
  const io = req.app.locals.io;
  const socketIdOfUpdatedUser = getSocketId(id);
  io.to(socketIdOfUpdatedUser).emit("userUpdated", updatedUser);
  res.status(201).json(updatedUser);
};

const ActivateUser = async (req, res) => {
  const {id} = req.body;
  const result = await activateUsers(id);
  res.status(200).json(result);
};

const DeactivateUser = async (req, res) => {
  const {id} = req.body;
  const result = await deactivateUsers(id);
  const io = req.app.locals.io;
  const socketIdOfUpdatedUser = getSocketId(id);
  io.to(socketIdOfUpdatedUser).emit("userUpdated", {result});
  res.status(200).json(result);
};

const GetRolesForUser = async (req, res) => {
  const result = await getAllRolesForUser();
  res.status(200).json(result);
};

const UserRoleType = async (req, res) => {
  const {id} = req.params;
  const result = await userRoleType(id);
  res.status(200).json(result);
};

export default {
  CreateUserHandler,
  GetAllUsers,
  GetUserById,
  EditUserDetails,
  ActivateUser,
  DeactivateUser,
  UserRoleType,
  GetRolesForUser,
  GetAllUsersByRoleId,
};
