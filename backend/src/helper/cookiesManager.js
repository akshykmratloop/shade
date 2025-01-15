const cookieName = "authToken";
const cookiesConfig = {
  httpOnly: true,
  secure: process.env.MODE === "production",
  sameSite: "Strict",
};

export const setCookie = (res, value, name) => {
  res.cookie(name || cookieName, value, cookiesConfig);
  return res;
};

export const getCookie = (req, name) => req.cookies?.[name || cookieName];


export const clearCookie = (res, name) => {
  res.clearCookie(name || cookieName, cookiesConfig);
  return res;
};
