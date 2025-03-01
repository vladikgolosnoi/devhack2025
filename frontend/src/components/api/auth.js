import { apiRequest } from "./request";

export async function login(username, password) {
  try {
    const data = await apiRequest(
      "/token/",
      "POST",
      { username, password },
      false
    );
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

export async function register(userData) {
  return await apiRequest("/accounts/register/", "POST", userData, false);
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
