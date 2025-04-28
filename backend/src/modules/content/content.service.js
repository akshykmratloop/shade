import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import {
  fetchResources,
  assignUserToResource,
  fetchEligibleUsers,
  fetchResourceInfo,
  fetchAssignedUsers,
  fetchContent,
  findResourceById,
  fetchAllResourcesWithContent,
  createOrUpdateVersion,
} from "../../repository/content.repository.js";

const getResources = async (
  resourceType,
  resourceTag,
  relationType,
  isAssigned,
  search,
  status,
  pageNum,
  limitNum,
  fetchType
) => {
  if (fetchType === "CONTENT") {
    const resources = await fetchAllResourcesWithContent(
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
      response: "Resources fetched successfully with content",
      // resources: resources,
    });
    return { message: "Success", resources };
  }
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
    response: "Resources fetched successfully without content",
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

const updateContent = async (saveAs, content) => {
  const { resourceId } = content;
  const isResourceExist = await findResourceById(resourceId);
  assert(isResourceExist, "NOT_FOUND", "Resource not found");

  // If saveAs is provided, update the version status in the content
  if (saveAs && content.newVersionEditMode) {
    content.newVersionEditMode.versionStatus = saveAs;
  }

  const updatedContent = await createOrUpdateVersion(resourceId, content);
  logger.info({
    response: "Content updated successfully",
    updatedContent: updatedContent,
  });
  return { message: "Success", content: updatedContent };
};

export {
  getResources,
  getResourceInfo,
  getEligibleUser,
  assignUser,
  getAssignedUsers,
  getContent,
  updateContent,
};
