// import prisma from "../../helper/db.js";
import {
  createUserHandler,
  fetchAllUsers,
  updateUser,
} from "../../repository/user.repository.js";

const createUser = async (name, email, password, roles) => {
  return await createUserHandler(name, email, password, roles);
};

const getAllUsers = async () => {
  return await fetchAllUsers();
};

const editUserDetails = async (userId, name, email, password, roles) => {
  return await updateUser(userId, name, email, password, roles);
};

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({where: {email}});
};

export {createUser, findUserByEmail, getAllUsers, editUserDetails};
