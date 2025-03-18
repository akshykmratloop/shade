import AuthModule from "../modules/auth/index.js";
import UserModule from "../modules/user/index.js";
import RolesModule from "../modules/roles/index.js";
import PermissionModule from "../modules/permissions/index.js";
// import PageModule from '../modules/page';

const modules = [AuthModule, RolesModule, PermissionModule, UserModule];

const useModules = (app) => {
  modules.forEach((module) => module.init(app));
};

export default useModules;
