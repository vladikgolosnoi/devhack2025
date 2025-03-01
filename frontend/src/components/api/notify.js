import { apiRequest } from "./request";

export async function getNotifications() {
  return apiRequest("/notify/notifications/");
}

export async function claimGift() {
  return apiRequest("/notify/gift-claim/", "POST");
}

export async function markNotificationsRead() {
  return apiRequest("/notify/mark-read/", "POST");
}
