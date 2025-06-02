import {logger} from "../../config/logConfig.js";
import {fetchContentForWebsite} from "../../repository/website.repository.js";

const getContentForWebsite = async (resourceId) => {
  const content = await fetchContentForWebsite(resourceId);
  logger.info({
    response: "Content fetched successfully",
    // content: content,
  });
  return {message: "Success", content};
};

export {getContentForWebsite};
