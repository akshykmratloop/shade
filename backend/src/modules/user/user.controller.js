import {
  createUser,
  editUserDetails,
  findUserByEmail,
  getAllUsers,
} from "./user.service.js";

const createUserHandler = async (req, res) => {
  const {name, email, password, roles} = req.body;
  try {
    const user = await createUser(name, email, password, roles);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const allUser = await getAllUsers();
    res.status(201).json(allUser);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const EditUserDetails = async (req, res) => {
  const {userId} = req.params;
  const {name, email, password, roles} = req.body;
  try {
    const updatedUser = await editUserDetails(
      userId,
      name,
      email,
      password,
      roles
    );
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

export default {createUserHandler, GetAllUsers, EditUserDetails};
