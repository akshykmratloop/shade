import {
  getAllNotification,
  markAllNotification,
  markNotification,
} from "./notification.service.js";

const GetAllNotification = async (req, res) => {
  const {id} = req.params;
  const notifications = await getAllNotification(id);
  res.status(200).json(notifications);
};

const MarkNotification = async (req, res) => {
  const {id} = req.params;
  const mark = await markNotification(id);
  res.status(200).json(mark);
};

const MarkAllNotification = async (req, res) => {
  const {id} = req.params;
  const mark = await markAllNotification(id);
  res.status(200).json(mark);
};

export default {GetAllNotification, MarkNotification, MarkAllNotification};
