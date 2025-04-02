import {getAllNotification} from "./notification.service.js";

const GetAllNotification = async (req, res) => {
  const {id} = req.params;
  const notifications = await getAllNotification(id);
  res.status(200).json(notifications);
};

export default {GetAllNotification};
