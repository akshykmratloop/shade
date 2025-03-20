// import prisma from "../../helper/db.js";
import {
  createUserHandler,
  fetchAllUsers,
  updateUser,
  findUserById,
} from "../../repository/user.repository.js";
import {assert, assertEvery} from "../../errors/assertError.js";
import {logger} from "../../config/logConfig.js";

const createUser = async (name, email, password, phone, roles) => {
  return await createUserHandler(name, email, password, phone, roles);
};

const getAllUsers = async (name, email, phone, status, page, limit) => {
  const users = await fetchAllUsers(name, email, phone, status, page, limit);
  logger.info({response: "user fetched successfully", users: users});
  return {message: "user fetched successfully", users};
};

const getUserById = async (id) => {
  const user = await findUserById(id); // to bring the roles
  assert(user, "NOT_FOUND", "user not found");
  logger.info({response: "user fetched successfully", user: user});
  return {message: "user fetched successfully", user};
};

const editUserDetails = async (userId, name, password, phone, roles) => {
  return await updateUser(userId, name, password, phone, roles);
};

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({where: {email}});
};

export {createUser, findUserByEmail, getAllUsers, getUserById, editUserDetails};
