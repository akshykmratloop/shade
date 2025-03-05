import { verifyToken } from "../helper/index.js";
import { assert } from "../errors/assertError.js";

const authenticateUser = (req, res, next) => {
  let token = req.headers["authorization"];
  // if token not found
  assert(
    token || !token.startsWith("Bearer "),
    "UNAUTHORIZED",
    "Token Missing"
  );
  token = token.split(" ")[1]; // Extract JWT from "Bearer <token>"
  const decoded = verifyToken(token);
  req.user = decoded;
  next();
};

export { authenticateUser };

// Authenticate with Cookies
// import { verifyToken } from "../helper/index.js";
// import { assert } from "../errors/assertError.js";

// const authenticateUser = (req, res, next) => {
//   const tokenName = "authToken";
//   const token = req.cookies[tokenName];
//   // if token not found
//   assert(token, "UNAUTHORIZED", "Token Missing");
//   const user = verifyToken(token);
//   req.user = user;
//   next();
// };

// export { authenticateUser };