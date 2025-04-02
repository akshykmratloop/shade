import {logger} from "../../config/index.js";
import {assert, assertEvery} from "../../errors/assertError.js";

import {findAllNotification} from "../../repository/notification.repository.js";

const getAllNotification = async (id) => {
  const notifications = await findAllNotification(id);
  // if response is empty the throw error with assert
  assert(notifications, "FETCHING_FAILED", "something went wrong");
  //log information
  logger.info({response: "Fetched successfully"});
  return {
    message: "notification fetched successfully",
    notifications,
    ok: true,
  }; // if everything goes fine
};

export {getAllNotification};
