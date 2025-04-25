import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import {
  fetchResources,
  assignUserToResource,
  fetchEligibleUsers,
  fetchResourceInfo,
  fetchAssignedUsers,
  fetchContent,
} from "../../repository/content.repository.js";

const getResources = async (
  resourceType,
  resourceTag,
  relationType,
  isAssigned,
  search,
  status,
  pageNum,
  limitNum
) => {
  const resources = await fetchResources(
    resourceType,
    resourceTag,
    relationType,
    isAssigned,
    search,
    status,
    pageNum,
    limitNum
  );
  logger.info({
    response: "Resources fetched successfully",
    // resources: resources,
  });
  return { message: "Success", resources };
};

const getResourceInfo = async (resourceId) => {
  const resourceInfo = await fetchResourceInfo(resourceId);
  logger.info({
    response: "Page Info fetched successfully",
    // resourceInfo: resourceInfo,
  });
  return { message: "Success", resourceInfo };
};

const getAssignedUsers = async (resourceId) => {
  const assignedUsers = await fetchAssignedUsers(resourceId);
  logger.info({
    response: `assignedUsers fetched successfully`,
    // assignedUsers: assignedUsers,
  });
  return { message: "Success", assignedUsers };
};

const getEligibleUser = async (roleType, permission) => {
  const eligibleUsers = await fetchEligibleUsers(roleType, permission);
  logger.info({
    response: `eligibleUsers fetched successfully for ${roleType} and ${permission}`,
    // eligibleUsers: eligibleUsers,
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
    // assignedUsers: assignedUsers,
  });
  return { message: "Success", assignedUsers };
};

const getContent = async (resourceId) => {
  const content = await fetchContent(resourceId);
  logger.info({
    response: "Content fetched successfully",
    // content: content,
  });
  return { message: "Success", content };
};

const updateContent = async (content) => {
  // const content = await fetchContent(resourceId);
  logger.info({
    response: "Content Received successfully",
    content: content,
  });
  return { message: "Success", content };
};

export {
  getResources,
  getResourceInfo,
  getEligibleUser,
  assignUser,
  getAssignedUsers,
  getContent,
  updateContent
};
