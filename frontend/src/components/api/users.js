import { apiRequest } from "./request";

// Функция для получения списка пользователей
export async function getUsers() {
  try {
    const response = await apiRequest("/accounts/users/", "GET");
    return response;
  } catch (error) {
    console.error("Ошибка загрузки пользователей:", error);
    return null;
  }
}
