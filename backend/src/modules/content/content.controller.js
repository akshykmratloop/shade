// import {eventEmitter} from "../../helper/event.js";
import { createNotification } from "../../repository/notification.repository.js";
import {
  getResources,
  getResourceInfo,
  getEligibleUser,
  assignUser,
  getAssignedUsers,
  getContent,
} from "./content.service.js";

const GetResources = async (req, res) => {
  const { resourceType, ResourceTag, relationType, isAssigned, search, status, page, limit } =
    req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 100;
  const response = await getResources(
    resourceType,
    ResourceTag,
    relationType,
    isAssigned,
    search,
    status,
    pageNum,
    limitNum
  );
  res.status(200).json(response);
};

const GetResourceInfo = async (req, res) => {
  const { resourceId } = req.query;
  const response = await getResourceInfo(resourceId);
  res.status(200).json(response);
};

const GetAssignedUsers = async (req, res) => {
  const { resourceId } = req.query;
  const response = await getAssignedUsers(resourceId);
  res.status(200).json(response);
};

const GetEligibleUser = async (req, res) => {
  const { roleType, permission } = req.query;
  const response = await getEligibleUser(roleType, permission);
  res.status(200).json(response);
};

const AssignUser = async (req, res) => {
  const { resourceId, manager, editor, verifiers, publisher } = req.body;
  const response = await assignUser(
    resourceId,
    manager,
    editor,
    verifiers,
    publisher
  );
  res.status(200).json(response);
};

const GetContent = async (req, res) => {
  const { resourceId } = req.query;
  const response = await getContent(resourceId);
  res.status(200).json(response);
};

export default {
  GetResources,
  GetResourceInfo,
  GetEligibleUser,
  AssignUser,
  GetAssignedUsers,
  GetContent,
};
