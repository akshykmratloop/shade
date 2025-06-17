export const Img_url = "https://res.cloudinary.com/dmcxybhjm/image/upload/v1745838647/"
const BASE_URL = "http://localhost:3000/";

const auth = "auth";
const role = "role";
const permission = "permission";
const user = "user";
const notification = "notification";
const content = "content";
const media = "media"


const api = {
  login: `${auth}/login`, // API for Auth
  signup: `${auth}/signup`,
  mfa_login: `${auth}/mfa/login`,
  mfa_verify: `${auth}/mfa/verify`,
  forgotPassword: `${auth}/forgotPassword`,
  forgotPassword_verify: `${auth}/forgotPassword/verify`,
  forgotPassword_update: `${auth}/forgotPassword/updatePassword`,
  resetPassword: `${auth}/resetPass`,
  refreshToken: `${auth}/refreshToken`,
  resendOTP: `${auth}/resendOtp`,

  userLogs: `${auth}/logs`, // API for logs

  fetchRoles: `${role}/roles`, // API for role start from here
  getRoleById: `${role}/`,
  fetchRoleType: `${role}/roleType`,
  createRole: `${role}/create`,
  activateRole: `${role}/activate`,
  deactivateRole: `${role}/deactivate`,
  updateRole: `${role}/update`,

  fetchPermissionsByRoleType: `${permission}/permissionsByRoleType/`, //permisions

  getUsers: `${user}/getAllUsers`, // API for users from here
  createUser: `${user}/create`,
  getUserById: `${user}/`,
  updateUser: `${user}/updateUser/`,
  activateUser: `${user}/activate`,
  deactivateUser: `${user}/deactivate`,

  getNotifications: `${notification}/`, // API for notifications
  markAllNotificationAsRead: `${notification}/read-all/`, // API for marking notification as read

  // Pages
  getResources: `${content}/getResources`, // Resources
  getResourceInfo: `${content}/getResourceInfo/`,
  getEligibleUsers: `${content}/getEligibleUsers`,
  assignUser: `${content}/assignUser`,
  removeAssignedUsers: `${content}/removeAssignedUser/`,
  getAssignedUsers: `${content}/getAssignedUsers`,

  getContent: `${content}/getContent`, // Content of Resources
  updateContent: `${content}/updateContent`,
  publishContent: `${content}/directPublishContent`,

  getRequests: `${content}/getRequests`, // requests query
  generateRequest: `${content}/generateRequest`,
  requestInfo: `${content}/getRequestInfo/`,
  approveRequest: `${content}/approveRequest/`,
  rejectRequest: `${content}/rejectRequest/`,

  versionsList: `${content}/getVersionsList/`, // versions query
  versionInfo: `${content}/getVersionInfo/`,
  restoreVersion: `${content}/restoreVersion/`,
  scheduleRequest: `${content}/scheduleRequest/`,

  // DASHBOARD INSIGHT
  getDashboardInsight: `${content}/getDashboardInsight`, // API for dashboard insight

  // Media
  uploadMedia: `${media}/upload`,
  deleteMedia: `${media}/delete`,
  getMedia: `${media}/getMedia`,

  route(route) {
    if (this[route]) {
      return BASE_URL + this[route];
    } else {
      throw new Error(`Route ${route} not found`);
    }
  },
};

export default api;
