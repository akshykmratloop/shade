// import {eventEmitter} from "../../helper/event.js";
import { createNotification } from "../../repository/notification.repository.js";
import {
  getAllMainPages,
  getPageInfo,
  getEligibleUser,
  assignUser,
} from "./content.service.js";

const GetAllMainPages = async (req, res) => {
  const { search, status, page, limit } = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 100;
  const response = await getAllMainPages(search, status, pageNum, limitNum);
  res.status(200).json(response);
};

const GetPageInfo = async (req, res) => {
    const { resourceId } = req.query;
    const response = await getPageInfo(resourceId);
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

export default {
  GetAllMainPages,
  GetPageInfo,
  GetEligibleUser,
  AssignUser,
};
