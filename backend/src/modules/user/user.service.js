// import prisma from "../../helper/db.js";
import {
  createUserHandler,
  fetchAllUsers,
  updateUser,
  findUserById,
  userActivation,
  userDeactivation,
  findRoleTypeByUserId,
} from "../../repository/user.repository.js";
import {assert, assertEvery} from "../../errors/assertError.js";
import {logger} from "../../config/logConfig.js";

const createUser = async (name, email, password, phone, roles) => {
  const user = await createUserHandler(name, email, password, phone, roles);
  logger.info({response: "user created successfully", user: user});
  return {message: "user created successfully", user};
};

const getAllUsers = async (name, email, phone, status, page, limit) => {
  const users = await fetchAllUsers(name, email, phone, status, page, limit);
  // logger.info({response: "user fetched successfully", users: users});
  return {message: "user fetched successfully", users};
};

const getUserById = async (id) => {
  const user = await findUserById(id); // to bring the roles
  assert(user, "NOT_FOUND", "user not found");
  logger.info({response: "user fetched successfully", user: user});
  return {message: "user fetched successfully", user};
};

const editUserDetails = async (id, name, password, phone, roles) => {
  let result = await updateUser(id, name, password, phone, roles);
  return {message: "User updated Successfully", result}; // changed for message to show at frontend at apr 7 11:32
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

const userRoleType = async (id) => {
  const roleType = await findRoleTypeByUserId(id);
  assert(roleType, "ROLETYPE_INVALID", "roleType not found");
  logger.info({response: `roleType fetched successfully`});
  return {message: "RoleType fetched successfully", roleType}; // if everything goes fine
};

export {
  createUser,
  findUserByEmail,
  getAllUsers,
  getUserById,
  editUserDetails,
  activateUsers,
  deactivateUsers,
  userRoleType,
};
