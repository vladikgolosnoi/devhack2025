import { apiRequest } from "./request";

export async function getWebsites() {
  return apiRequest("/websites/");
}

export async function createWebsite(data) {
  return apiRequest("/websites/", "POST", data);
}

export async function getWebsite(username, unique_id) {
  return apiRequest(`/websites/manage/${username}/${unique_id}/`);
}

export async function updateWebsite(username, unique_id, data) {
  return apiRequest(`/websites/manage/${username}/${unique_id}/`, "PUT", data);
}

export async function deleteWebsite(username, unique_id) {
  return apiRequest(`/websites/manage/${username}/${unique_id}/`, "DELETE");
}

export async function getSharedWebsite(username, unique_id) {
  return apiRequest(`/websites/${username}/${unique_id}/`);
}

export async function trackPageView(username, unique_id) {
  return apiRequest(`/websites/${username}/${unique_id}/view/`, "POST");
}

export async function getPublishedWebsites(userId) {
  return apiRequest(`/websites/profile/${userId}`, "GET");
}

export async function togglePublishWebsite(unique_id, show_in_profile) {
  return apiRequest(`/websites/publish/${unique_id}/`, "PATCH", {
    show_in_profile,
  });
}
