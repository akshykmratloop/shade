import { verifyToken } from "../helper/index.js";
import { assert } from "../errors/assertError.js";

const authenticateUser = (req, res, next) => {
  const tokenName = "authToken";
  const token = req.cookies[tokenName];
  // if token not found
  assert(token, "UNAUTHORIZED", "Token Missing");
  const user = verifyToken(token);
  req.user = user;
  next();
};

export { authenticateUser };
