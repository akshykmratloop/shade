// import prisma from "../../helper/db.js";
import {
  createUserHandler,
  fetchAllUsers,
  updateUser,
  findUserById,
  userActivation,
  userDeactivation,
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

const activateUsers = async (id) => {
  const user = await userActivation(id);
  assert(user, "USER_INVALID", "user not found");
  logger.info({response: `user ${id} is active now`});
  return {message: "User activated successfully", ok: true}; // if everything goes fine
};

const deactivateUsers = async (id) => {
  const user = await userDeactivation(id);
  assert(user, "USER_INVALID", "user not found");
  logger.info({response: `user ${id} is deactive now`});
  return {message: "User deactivated successfully", ok: true}; // if everything goes fine
};

export {
  createUser,
  findUserByEmail,
  getAllUsers,
  getUserById,
  editUserDetails,
  activateUsers,
  deactivateUsers,
};
