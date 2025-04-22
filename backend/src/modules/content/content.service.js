import {logger} from "../../config/index.js";
import {assert, assertEvery} from "../../errors/assertError.js";
import {
    assignUserToResource,
    fetchEligibleUsers,
    findAllPages,
    findPageInfo,

} from "../../repository/content.repository.js";

const getAllMainPages = async (searchTerm, status, page, limit) => {
  const mainPages = await findAllPages(searchTerm, status, page, limit); // to bring the roles
  logger.info({response: "Main pages fetched successfully", mainPages: mainPages});
  return {message: "Success", mainPages};
};

const getPageInfo = async (resourceId) => {
    const pageInfo = await findPageInfo(resourceId); // to bring the roles
    logger.info({response: "Page Info fetched successfully", pageInfo: pageInfo});
    return {message: "Success", pageInfo};
  };

const getEligibleUser = async (roleType, permission) => {
    const eligibleUsers = await fetchEligibleUsers(roleType, permission); // to bring the roles
    logger.info({response:`Users fetched successfully for ${roleType} and ${permission}`, eligibleUsers: eligibleUsers});
    return {message: "Success", eligibleUsers};
  };

  
const assignUser = async (resourceId,
    manager,
    editor,
    verifiers,
    publisher) => {
    const assignedUsers = await assignUserToResource(resourceId, manager,
        editor,
        verifiers,
        publisher); // to bring the roles
    logger.info({response:`users assigned successfully`, assignedUsers: assignedUsers});
    return {message: "Success", assignedUsers};
  };



export {
  getAllMainPages,
  getPageInfo,
  getEligibleUser,
  assignUser,
};
