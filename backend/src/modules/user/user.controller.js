import {
  activateUsers,
  createUser,
  deactivateUsers,
  editUserDetails,
  findUserByEmail,
  getAllUsers,
  getUserById,
  userRoleType,
} from "./user.service.js";

const createUserHandler = async (req, res) => {
  const {name, email, password, phone, roles} = req.body;
  const user = await createUser(name, email, password, phone, roles);
  res.locals.entityId = user.id;

  res.status(201).json(user);
};

const GetAllUsers = async (req, res) => {
  const {name, email, phone, status, page = 1, limit = 10} = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
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

const EditUserDetails = async (req, res) => {
  const {id} = req.params;
  const {name, password, phone, roles} = req.body;

  const updatedUser = await editUserDetails(id, name, password, phone, roles);
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
  res.status(200).json(result);
};

const UserRoleType = async (req, res) => {
  const {id} = req.params;
  const result = await userRoleType(id);
  res.status(200).json(result);
};

export default {
  createUserHandler,
  GetAllUsers,
  GetUserById,
  EditUserDetails,
  ActivateUser,
  DeactivateUser,
  UserRoleType,
};
