// import {eventEmitter} from "../../helper/event.js";
import { createNotification } from "../../repository/notification.repository.js";
import {
  getResources,
  getResourceInfo,
  getEligibleUser,
  assignUser,
  getAssignedUsers,
  getContent,
  updateContent
} from "./content.service.js";

const GetResources = async (req, res) => {
  const { resourceType, resourceTag, relationType, isAssigned, search, status, page, limit, fetchType } =
    req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 100;
  const response = await getResources(
    resourceType,
    resourceTag,
    relationType,
    isAssigned,
    search,
    status,
    pageNum,
    limitNum,
    fetchType
  );
  res.status(200).json(response);
};

const GetResourceInfo = async (req, res) => {
  const { resourceId } = req.params;
  const response = await getResourceInfo(resourceId);
  res.status(200).json(response);
};

const GetAssignedUsers = async (req, res) => {
  const { resourceId } = req.params;
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
  const { resourceId } = req.params;
  const response = await getContent(resourceId);
  res.status(200).json(response);
};

const UpdateContent = async (req, res) => {
  const { saveAs } = req.query;
  const { content } = req.body;
  console.log(content, "content");
  const response = await updateContent(saveAs,content);
  res.status(200).json(response);
};
export default {
  GetResources,
  GetResourceInfo,
  GetEligibleUser,
  AssignUser,
  GetAssignedUsers,
  GetContent,
  UpdateContent
};
