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
  publishContent,
  updateContentAndGenerateRequest,
  fetchRequests,
  fetchRequestInfo,
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
    response: `Users assigned successfully`,
    // assignedUsers: assignedUsers,
  });
  return { message: "Users assigned successfully", assignedUsers };
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
  // If saveAs is provided, update the version status in the content
  if (saveAs && content.newVersionEditMode) {
    content.newVersionEditMode.versionStatus = saveAs;
  }
  const updatedContent = await createOrUpdateVersion(content);
  logger.info({
    response: "Content updated successfully",
    updatedContent: updatedContent,
  });
  return { message: updatedContent.message, resource: updatedContent.resource };
};

const directPublishContent = async (content, userId) => {
  const publishedContent = await publishContent(content, userId);
  logger.info({
    response: "Content published successfully",
    publishedContent: publishedContent,
  });
  return { message: "Success", content: publishedContent };
};

const generateRequest = async (content, userId) => {
  const request = await updateContentAndGenerateRequest(content, userId);
  logger.info({
    response: "Content update request has been generated",
    request: request,
  });
  return { message: "Success", content: request };
};

const getRequest = async (
  userId,
  userRole,
  search,
  status,
  pageNum,
  limitNum
) => {
  const requests = await fetchRequests(
    userId,
    userRole,
    search,
    status,
    pageNum,
    limitNum
  );
  logger.info({
    response: "Requests fetched successfully",
    // requests: requests,
  });
  return { message: "Success", requests };
};

const getRequestInfo = async (requestId) => {
  const requestInfo = await fetchRequestInfo(requestId);
  logger.info({
    response: "Request Info fetched successfully",
    // requestInfo: requestInfo,
  });
  return { message: "Success", requestInfo };
};

export {
  getResources,
  getResourceInfo,
  getEligibleUser,
  assignUser,
  getAssignedUsers,
  getContent,
  updateContent,
  directPublishContent,
  generateRequest,
  getRequest,
  getRequestInfo,
};
