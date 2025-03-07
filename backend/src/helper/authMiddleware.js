
// Authenticate with Cookies
import { verifyToken } from "../helper/index.js";
import { assert } from "../errors/assertError.js";

const authenticateUser = (req, res, next) => {
  
  let token = req.headers["authorization"];

  // if token not found
  assert(token, "UNAUTHORIZED", "Token Missing");
  assert(
    token.startsWith("Bearer "),
    "UNAUTHORIZED",
    "Authorization failed: 'Bearer' token is missing or malformed."
  );

  token = token.split(" ")[1]; // Extract JWT from "Bearer <token>"

  const user = verifyToken(token);
  req.user = user;
  next();
};

export { authenticateUser };

