import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import {
  assignUserToResource,
  fetchEligibleUsers,
  fetchPages,
  fetchPageInfo,
  fetchAssignedUsers,
  fetchContent,
} from "../../repository/content.repository.js";

const getPages = async (
  pageType,
  relationType,
  pageTag,
  search,
  status,
  pageNum,
  limitNum
) => {
  const mainPages = await fetchPages(
    pageType,
    relationType,
    pageTag,
    search,
    status,
    pageNum,
    limitNum
  );
  logger.info({
    response: "Main pages fetched successfully",
    mainPages: mainPages,
  });
  return { message: "Success", mainPages };
};

const getPageInfo = async (resourceId) => {
  const pageInfo = await fetchPageInfo(resourceId);
  logger.info({
    response: "Page Info fetched successfully",
    pageInfo: pageInfo,
  });
  return { message: "Success", pageInfo };
};

const getAssignedUsers = async (resourceId) => {
  const assignedUsers = await fetchAssignedUsers(resourceId);
  logger.info({
    response: `assignedUsers fetched successfully`,
    assignedUsers: assignedUsers,
  });
  return { message: "Success", assignedUsers };
};

const getEligibleUser = async (roleType, permission) => {
  const eligibleUsers = await fetchEligibleUsers(roleType, permission);
  logger.info({
    response: `eligibleUsers fetched successfully for ${roleType} and ${permission}`,
    eligibleUsers: eligibleUsers,
  });
  return { message: "Success", eligibleUsers };
};

const assignUser = async (
  resourceId,
  manager,
  editor,
  verifiers,
  publisher
) => {
  const assignedUsers = await assignUserToResource(
    resourceId,
    manager,
    editor,
    verifiers,
    publisher
  );
  logger.info({
    response: `users assigned successfully`,
    assignedUsers: assignedUsers,
  });
  return { message: "Success", assignedUsers };
};

const getContent = async (resourceId) => {
  const content = await fetchContent(resourceId);
  logger.info({
    response: "Content fetched successfully",
    content: content,
  });
  return { message: "Success", content };
};

export {
  getPages,
  getPageInfo,
  getEligibleUser,
  assignUser,
  getAssignedUsers,
  getContent,
};
