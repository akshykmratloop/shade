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

    if (response.status === 555) {
      clearSession();
      return { error: "Critical session error. Please log in again.", ok: false };
    }

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
export async function userLogs(query) {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(api.route("userLogs"), "GET");
  }

  const params = new URLSearchParams(query).toString();
  const url = `${api.route("userLogs")}?${params}`;

  return await makerequest(url, "GET");
}

export async function fetchRoles(query) {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(api.route("fetchRoles"), "GET");
  }

  const params = new URLSearchParams(query).toString();
  const url = `${api.route("fetchRoles")}?${params}`;

  return await makerequest(url, "GET");
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
// export async function getAllusers(query) {
//   return await makerequest(api.route("getUsers"), "GET");
// }

export async function getAllusers(query) {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(api.route("getUsers"), "GET");
  }

  const params = new URLSearchParams(query).toString();
  const url = `${api.route("getUsers")}?${params}`;

  return await makerequest(url, "GET");
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

export async function updateProfile(data) {
  return await makerequest(
    api.route("updateProfile"),
    "PUT",
    JSON.stringify(data),
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
export async function getNotificationsbyId(id, page = 1, search = "", filters = {}) {
  // Build query string
  const params = new URLSearchParams({
    page: page.toString(),
    // limit: limit.toString(),
    search: search || "",
    // You can add more filter params if needed
  });

  const uri = api.route("getNotifications") + id + "?" + params.toString();
  // const uri = api.route("getNotifications") + id;
  // console.log(uri, "uri==============");
  return await makerequest(uri, "GET");
}

export async function deleteNotifications(id) {
  const uri = api.route("clearAll") + id;
  return await makerequest(uri, "DELETE");
}

export async function markAllNotificationAsRead(id) {
  return await makerequest(
    api.route("markAllNotificationAsRead") + id,
    "PUT",
    // JSON.stringify(id),
    ContentType.json
  );
}

export async function getResources(query) {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(api.route("getResources"), "GET");
  }

  const params = new URLSearchParams(query).toString();
  const url = `${api.route("getResources")}?${params}`;

  return await makerequest(url, "GET");
}

export async function getResourceInfo(query) {
  return await makerequest(api.route("getResourceInfo") + query, "GET");

}

// export async function getEligibleUsers(query) {
//   if (!query || typeof query !== "object") {
//     return await makerequest(api.route("getEligibleUsers"), "GET");
//   }

//   const [key] = Object.keys(query);
//   const value = query[key];

//   return await makerequest(
//     `${api.route("getEligibleUsers")}?${key}=${value}`,
//     "GET"
//   );
// }
export async function getEligibleUsers(query) {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(api.route("getEligibleUsers"), "GET");
  }

  const params = new URLSearchParams(query).toString();
  const url = `${api.route("getEligibleUsers")}?${params}`;

  return await makerequest(url, "GET");
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

export async function getAssignedUsers(param) {
  return await makerequest(`${api.route("getAssignedUsers")}/${param}`, "GET");
}

export async function removeAssignedUsers(param) {
  return await makerequest(`${api.route("removeAssignedUsers")}${param}`, "PATCH");
}

// Content
export async function getContent(param) {
  return await makerequest(`${api.route("getContent")}/${param}`, "GET");
}

export async function getVersionContent(param) {
  return await makerequest(`${api.route("getVersionContent")}/${param}`, "GET");
}

//addResource

export async function addResource(body) {
  return await makerequest(
    `${api.route("addResource")}`,
    "POST",
    JSON.stringify(body),
    ContentType.json,
    true
  );
}

export async function updateContent(data) {
  return await makerequest(
    `${api.route("updateContent")}?saveAs=DRAFT`,
    "PUT",
    JSON.stringify(data),
    ContentType.json,
    true
  );
}

export async function publishContent(body) {
  return await makerequest(
    `${api.route("publishContent")}`,
    "POST",
    JSON.stringify(body),
    ContentType.json,
    true
  );
}

export async function schedulePublish(param, body) {
  return await makerequest(
    `${api.route("scheduleRequest")}${param}`,
    "POST",
    JSON.stringify(body),
    ContentType.json,
    true
  );
}

export async function getAllFilters(query) {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(api.route("getAllFilters"), "GET");
  }

  const params = new URLSearchParams(query).toString();
  const url = `${api.route("getAllFilters")}?${params}`;

  return await makerequest(url, "GET");
}

export async function generateRequest(body) {
  return await makerequest(
    `${api.route("generateRequest")}`,
    "PUT",
    JSON.stringify(body),
    ContentType.json,
    true
  );
}

export async function getRequestInfo(param) {
  return await makerequest(
    `${api.route("requestInfo")}` + param,
    "GET",
  );
}

// export async function versionsList(param) {
//   return await makerequest(
//     `${api.route("versionsList")}` + param,
//     "GET",
//   );
// }
export async function versionsList(param, query) {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(api.route("versionsList"), "GET");
  }

  const params = new URLSearchParams(query).toString();
  const url = `${api.route("versionsList")}${param}?${params}`;

  return await makerequest(url, "GET");
}

export async function versionInfo(param) {
  return await makerequest(
    `${api.route("versionInfo")}` + param,
    "GET",
  );
}

//restoreVersion
export async function restoreVersion(param) {
  return await makerequest(
    `${api.route("restoreVersion")}` + param,
    "GET",
  );
}



export async function approveRequest(param) {
  return await makerequest(
    `${api.route("approveRequest")}` + param,
    "POST",
    JSON.stringify({}),
    ContentType.json,
    true
  );
}

export async function rejectedRequest(param, body) {
  return await makerequest(
    `${api.route("rejectRequest")}` + param,
    "POST",
    JSON.stringify(body),
    ContentType.json,
    true
  );
}



// DASHBOARD INSIGHT
export async function dashboardInsight() {
  return await makerequest(`${api.route("getDashboardInsight")}`, "GET");
}


export async function getRequests(query) {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(api.route("getRequests"), "GET");
  }

  const params = new URLSearchParams(query).toString();
  const url = `${api.route("getRequests")}?${params}`;

  return await makerequest(url, "GET");
}

export async function uploadMedia(data) {
  return await makerequest(
    `${api.route("uploadMedia")}`,
    "POST",
    data,
  );
}

export async function deleteMedia(id) {
  if (typeof id === "string" && id.trim() !== "") {
    return await makerequest(
      `${api.route("deleteMedia")}/${id}`,
      "DELETE",
      id,
      {},
      true
    );
  } else {
    return "No Id recieved";
  }
}

// export async function fetchAllImages(query) {
//   if (!query || typeof query !== "object") {
//     return await makerequest(api.route("getMedia"), "GET");
//   } else if (!query.resourceId) {
//     throw new Error("No resource Id")
//   }

//   const [key] = Object.keys(query);
//   const value = query[key];

//   return await makerequest(`${api.route("getMedia")}?${key}=${value}`, "GET");
// }

export async function fetchAllImages(query) {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(api.route("getMedia"), "GET");
  }

  const params = new URLSearchParams(query).toString();
  const url = `${api.route("getMedia")}?${params}`;

  return await makerequest(url, "GET");
}

export async function deleteLogsByDateRange({ startDate, endDate }) {
  return await makerequest(
    api.route("userLogs") + "/delete",
    "POST",
    JSON.stringify({ startDate, endDate }),
    ContentType.json
  );
}

export async function createReminder(data) {
  return await makerequest(
    api.route("createReminder"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function getReceivedReminders() {
  const url = api.route("getReceivedReminders");
  return await makerequest(url, "GET");
}

export async function getSentReminders() {
  const url = api.route("getSentReminders") ;
  return await makerequest(url, "GET");
}

export async function replyToReminder(id, response) {
  return await makerequest(
    api.route("replyToReminder") + id,
    "POST",
    JSON.stringify({ response }),
    ContentType.json
  );
}

export async function getReminderUsers() {
  return await makerequest(api.route("reminderUsers"), "GET");
}
