import { Router } from "express";   
import RolesRoutes from "./roles.routes.js";

const router = Router()
router.use("/role", RolesRoutes);

export default {
  init: (app) => app.use(router),
};
