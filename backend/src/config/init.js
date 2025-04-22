import AuthModule from "../modules/auth/index.js";
import UserModule from "../modules/user/index.js";
import RolesModule from "../modules/roles/index.js";
import PermissionModule from "../modules/permissions/index.js";
import NotificationModule from "../modules/notification/index.js";
import ContentModule from '../modules/content/index.js';
import MediaModule from '../modules/media/index.js';

const modules = [
  AuthModule,
  RolesModule,
  PermissionModule,
  UserModule,
  NotificationModule,
  ContentModule,
  MediaModule,
];

const useModules = (app) => {
  modules.forEach((module) => module.init(app));
};

export default useModules;
