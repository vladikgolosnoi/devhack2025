// const BASE_URL = "https://lastingly-crucial-nuthatch.cloudpub.ru/api";
const BASE_URL = "http://localhost:8000/api";

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return null;

  try {
    const response = await fetch(`${BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refresh_token }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.detail || "Не удалось обновить токен");

    localStorage.setItem("access_token", data.access);
    return data.access;
  } catch (error) {
    console.error("Ошибка обновления токена:", error.message);
    logout();
    return null;
  }
}

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  auth = true
) {
  let access_token = localStorage.getItem("access_token");
  const headers = { Accept: "application/json" };

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && access_token) {
    headers["Authorization"] = `Bearer ${access_token}`;
  }

  try {
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : null,
    });

    if (response.status === 401 && auth) {
      access_token = await refreshToken();
      if (access_token) {
        headers["Authorization"] = `Bearer ${access_token}`;
        response = await fetch(`${BASE_URL}${endpoint}`, {
          method,
          headers,
          body: body
            ? body instanceof FormData
              ? body
              : JSON.stringify(body)
            : null,
        });
      }
    }

    const contentType = response.headers.get("Content-Type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    if (!response.ok) throw new Error(data.detail || "Ошибка запроса");

    return data;
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.reload();
}
