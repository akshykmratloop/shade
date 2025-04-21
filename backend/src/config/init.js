import AuthModule from "../modules/auth/index.js";
import UserModule from "../modules/user/index.js";
import RolesModule from "../modules/roles/index.js";
import PermissionModule from "../modules/permissions/index.js";
import NotificationModule from "../modules/notification/index.js";
// import PageModule from '../modules/page';

const modules = [
  AuthModule,
  RolesModule,
  PermissionModule,
  UserModule,
  NotificationModule,
];

const useModules = (app) => {
  modules.forEach((module) => module.init(app));
};

export default useModules;
