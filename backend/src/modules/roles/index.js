import {Router} from "express";
import RolesRoutes from "./roles.routes.js";
import {authenticateUser} from "../../helper/index.js";

const router = Router();
router.use("/role", authenticateUser, RolesRoutes);

export default {
  init: (app) => app.use(router),
};
