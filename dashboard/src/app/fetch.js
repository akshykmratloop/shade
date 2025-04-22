import api from "../routes/backend";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return payload.exp * 1000 < Date.now(); // Check if expiration time has passed
  } catch (error) {
    return true; // Assume expired if there's an error
  }
};

const clearSession = () => {
  const theme = localStorage.getItem("theme"); // Preserve theme
  localStorage.clear(); // Clear all storage
  if (theme) {
    localStorage.setItem("theme", theme); // Restore theme
  }
  window.location.href = "/login"; // Redirect to login page
};

const makerequest = async (
  uri,
  method = "GET",
  body = undefined,
  headers = {},
  cookie = false,
  timeout = 10000
) => {
  let token = localStorage.getItem("token");

  // Check if token is expired and clear session if it is
  if (token && isTokenExpired(token)) {
    clearSession();
    return { error: "Session expired. Please log in again.", ok: false };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  method = method.toUpperCase();

  const finalHeaders = {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const options = {
    method,
    headers: finalHeaders,
    credentials: cookie ? "include" : "same-origin",
    signal: controller.signal,
  };

  if (body && method !== "GET") {
    options.body = body;
  }

  let result;
  try {
    const response = await fetch(uri, options);
    if (!response.ok) {
      const err = await response.json();
      throw err;
    }
    result = await response.json();
    result.ok = true;
  } catch (err) {
    if (err.name === "AbortError") {
      result = { error: "Request timed out" };
    } else {
      result = err;
      result.ok = false;
    }
  } finally {
    clearTimeout(timeoutId);
    return result;
  }
};

const ContentType = {
  json: { "Content-Type": "application/json" },
};

// fetch for auth
export async function login(data) {
  return await makerequest(
    api.route("login"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function mfaLogin(data) {
  return await makerequest(
    api.route("mfa_login"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function mfaVerify(data) {
  return await makerequest(
    api.route("mfa_verify"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function forgotPassReq(data) {
  return await makerequest(
    api.route("forgotPassword"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function forgotPassReqVerify(data) {
  return await makerequest(
    api.route("forgotPassword_verify"),
    "POST",
    JSON.stringify(data),
    ContentType.json,
    true
  );
}

export async function PassUpdate(data) {
  return await makerequest(
    api.route("forgotPassword_update"),
    "POST",
    JSON.stringify(data),
    ContentType.json,
    true
  );
}

export async function resetPassword(data) {
  return await makerequest(
    api.route("resetPassword"),
    "POST",
    JSON.stringify(data),
    ContentType.json,
    true
  );
}

export async function refreshToken() {
  return await makerequest(
    api.route("refreshToken"),
    "POST",
    JSON.stringify({}),
    {},
    true
  );
}

export async function resendOTP(data) {
  return await makerequest(
    api.route("resendOTP"),
    "POST",
    JSON.stringify(data),
    ContentType.json,
    true
  );
}

// fetch for Logs
export async function userLogs(data) {
  return await makerequest(api.route("userLogs"), "GET");
}

// fetch for roles
export async function fetchRoles(query) {
  if (!query || typeof query !== "object") {
    return await makerequest(api.route("fetchRoles"), "GET");
  }

  const [key] = Object.keys(query);
  const value = query[key];

  return await makerequest(`${api.route("fetchRoles")}?${key}=${value}`, "GET", JSON.stringify({}),
    {},
    true);

}

export async function getRoleById(id) {
  return await makerequest(api.route("getRoleById") + id, "GET");
}

export async function fetchRoleType() {
  return await makerequest(api.route("fetchRoleType"), "GET");
}

export async function createRole(data) {
  return await makerequest(
    api.route("createRole"),
    "POST",
    JSON.stringify(data),
    ContentType.json,
    true
  );
}

export async function activateRole(data) {
  return await makerequest(
    api.route("activateRole"),
    "PUT",
    JSON.stringify(data),
    ContentType.json,
    true
  );
}

export async function deactivateRole(data) {
  return await makerequest(
    api.route("deactivateRole"),
    "PUT",
    JSON.stringify(data),
    ContentType.json,
    true
  );
}

export async function updateRole(data) {
  console.log(data);
  return await makerequest(
    api.route("updateRole") + `/${data.id}`,
    "PUT",
    JSON.stringify(data.rolePayload),
    ContentType.json,
    true
  );
}

//fetch for permissions
export async function fetchPermissionsByRoleType(roleTypeId) {
  return await makerequest(
    api.route("fetchPermissionsByRoleType") + roleTypeId,
    "GET",
    JSON.stringify({}),
    {},
    true
  );
}

// fetch for Users
export async function getAllusers(query) {
  if (!query || typeof query !== "object") {
    return await makerequest(api.route("getUsers"), "GET");
  }

  const [key] = Object.keys(query);
  const value = query[key];

  return await makerequest(`${api.route("getUsers")}?${key}=${value}`, "GET");
}

export async function createUser(data) {
  return await makerequest(
    api.route("createUser"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function updateUser(data) {
  return await makerequest(
    api.route("updateUser") + data.id,
    "PUT",
    JSON.stringify(data.payload),
    ContentType.json
  );
}

export async function getUserById(id) {
  return await makerequest(api.route("getUserById") + id, "GET");
}

export async function activateUser(id) {
  return await makerequest(
    api.route("activateUser"),
    "PUT",
    JSON.stringify(id),
    ContentType.json
  );
}

export async function deactivateUser(id) {
  return await makerequest(
    api.route("deactivateUser"),
    "PUT",
    JSON.stringify(id),
    ContentType.json
  );
}

// fetch for Notifications
export async function getNotificationsbyId(id) {
  return await makerequest(
    api.route("getNotifications") + id,
    "GET",
    JSON.stringify(id),
    ContentType.json
  );
}

export async function markAllNotificationAsRead(id) {
  return await makerequest(
    api.route("markAllNotificationAsRead") + id,
    "PUT",
    // JSON.stringify(id),
    ContentType.json
  );
}

export async function getPages() {

  return await makerequest(
    api.route("getPages"),
    "GET"
  )
}

export async function getEligibleUsers(query) {
  if (!query || typeof query !== "object") {
    return await makerequest(api.route("getEligibleUsers"), "GET");
  }

  const [key] = Object.keys(query);
  const value = query[key];

  return await makerequest(`${api.route("getEligibleUsers")}?${key}=${value}`, "GET");
}

export async function assignUser(data) {

  return await makerequest(
    `${api.route("assignUser")}`,
    "POST",
    JSON.stringify(data),
    ContentType.json,
    true
  );
}

// export async function getAllusers(query) {
//   if (!query || typeof query !== "object") {
//     return await makerequest(api.route("getUsers"), "GET");
//   }

//   const [key] = Object.keys(query);
//   const value = query[key];

//   return await makerequest(`${api.route("getUsers")}?${key}=${value}`, "GET");
// }