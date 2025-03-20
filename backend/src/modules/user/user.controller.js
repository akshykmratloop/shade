import {
  createUser,
  editUserDetails,
  findUserByEmail,
  getAllUsers,
  getUserById,
} from "./user.service.js";

const createUserHandler = async (req, res) => {
  const {name, email, password, phone, roles} = req.body;
  const user = await createUser(name, email, password, phone, roles);
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
  const {userId} = req.params;
  const {name, password, phone, roles} = req.body;

  const updatedUser = await editUserDetails(
    userId,
    name,
    password,
    phone,
    roles
  );
  res.status(201).json(updatedUser);
};

export default {createUserHandler, GetAllUsers, GetUserById, EditUserDetails};
