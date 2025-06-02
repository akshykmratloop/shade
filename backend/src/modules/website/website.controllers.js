import {getContentForWebsite} from "./website.service.js";

const GetContentForWebsite = async (req, res) => {
  const {resourceId} = req.params;
  const response = await getContentForWebsite(resourceId);
  res.status(200).json(response);
};

export default {GetContentForWebsite};
