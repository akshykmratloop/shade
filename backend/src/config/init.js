import AuthModule from "../modules/auth/index.js";
// import UserModule from '../modules/user';
import RolesModule from '../modules/roles/index.js';
// import PageModule from '../modules/page';

const modules = [AuthModule, RolesModule];

const useModules = (app) => {
  modules.forEach((module) => module.init(app));
};

export default useModules;
