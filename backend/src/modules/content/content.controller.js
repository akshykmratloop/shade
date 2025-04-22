// import {eventEmitter} from "../../helper/event.js";
import { createNotification } from "../../repository/notification.repository.js";
import {
  getPages,
  getPageInfo,
  getEligibleUser,
  assignUser,
  getAssignedUsers,
  getContent,

} from "./content.service.js";

const GetPages = async (req, res) => {
  const { pageType, relationType, pageTag, search, status, page, limit } =
    req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 100;
  const response = await getPages(
    pageType,
    relationType,
    pageTag,
    search,
    status,
    pageNum,
    limitNum
  );
  res.status(200).json(response);
};

const GetPageInfo = async (req, res) => {
  const { resourceId } = req.query;
  const response = await getPageInfo(resourceId);
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
  GetPages,
  GetPageInfo,
  GetEligibleUser,
  AssignUser,
  GetAssignedUsers,
  GetContent,

};
